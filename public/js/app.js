// Configuration
const API_BASE_URL = '/api'; // Adjust this for your Cloudflare Worker endpoint

// Global variables
let currentMode = 'candidate';
let allQuestions = [];
let currentTest = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let testTimer;
let timeLeft = 3600; // 60 minutes
let testResults = [];
let editingQuestionId = null;
let userName = '';

// Add this for password protection
const ADMIN_PASSWORD = 'botabotabotaspeed'; // Change this to a secure password!

// Category names mapping
const categoryNames = {
    probability_stats: 'Probability & Statistics',
    ml_algorithms: 'ML Algorithms',
    data_preparation: 'Data Preparation',
    validation_metrics: 'Validation & Metrics'
};

// API Functions
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        showError('Network error. Please check your connection and try again.');
        throw error;
    }
}

async function loadQuestions() {
    try {
        const response = await apiRequest('/questions');
        allQuestions = response.questions || [];
        updateWelcomeStats();
        return allQuestions;
    } catch (error) {
        console.error('Failed to load questions:', error);
        allQuestions = [];
        updateWelcomeStats();
    }
}

async function saveQuestion(question) {
    try {
        const response = await apiRequest('/questions', {
            method: 'POST',
            body: JSON.stringify(question)
        });
        return response;
    } catch (error) {
        throw new Error('Failed to save question');
    }
}

async function updateQuestion(id, question) {
    try {
        const response = await apiRequest(`/questions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(question)
        });
        return response;
    } catch (error) {
        throw new Error('Failed to update question');
    }
}

async function deleteQuestionAPI(id) {
    try {
        const response = await apiRequest(`/questions/${id}`, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        throw new Error('Failed to delete question');
    }
}

async function submitTestResults(results) {
    try {
        const response = await apiRequest('/results', {
            method: 'POST',
            body: JSON.stringify(results)
        });
        return response;
    } catch (error) {
        console.error('Failed to submit results:', error);
        // Continue without saving to server
    }
}

async function loadAnalytics() {
    try {
        const response = await apiRequest('/analytics');
        return response;
    } catch (error) {
        console.error('Failed to load analytics:', error);
        return null;
    }
}

// UI Helper Functions
function showError(message) {
    const existingError = document.querySelector('.error');
    if (existingError) {
        existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    document.body.insertBefore(errorDiv, document.body.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function showSuccess(message) {
    const existingSuccess = document.querySelector('.success');
    if (existingSuccess) {
        existingSuccess.remove();
    }

    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    
    document.body.insertBefore(successDiv, document.body.firstChild);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function updateWelcomeStats() {
    const totalQuestionsEl = document.getElementById('totalQuestions');
    const totalPointsEl = document.getElementById('totalPoints');
    const coverageAreasEl = document.getElementById('coverageAreas');

    if (allQuestions.length === 0) {
        totalQuestionsEl.textContent = '0';
        totalPointsEl.textContent = '0';
        coverageAreasEl.innerHTML = '<li style="color: #dc3545;">No questions available. Please add questions in Administrator mode.</li>';
        return;
    }

    const totalQuestions = allQuestions.length;
    const totalPoints = allQuestions.reduce((sum, q) => sum + q.weight, 0);

    // Count questions by category
    const categoryCounts = {};
    allQuestions.forEach(q => {
        categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
    });

    totalQuestionsEl.textContent = totalQuestions;
    totalPointsEl.textContent = totalPoints;

    const coverageHTML = Object.entries(categoryCounts).map(([category, count]) => 
        `<li><strong>${categoryNames[category] || category}:</strong> ${count} questions</li>`
    ).join('');

    coverageAreasEl.innerHTML = coverageHTML;
}

// Mode and Navigation Functions
function setMode(mode) {
    if (mode === 'admin') {
        const enteredPassword = prompt('Enter admin password:');
        if (enteredPassword !== ADMIN_PASSWORD) {
            showError('Incorrect password. Access denied.');
            return; // Stay in candidate mode
        }
    }

    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const candidateNav = document.getElementById('candidateNavigation');
    const adminNav = document.getElementById('adminNavigation');

    if (mode === 'candidate') {
        candidateNav.classList.remove('hidden');
        adminNav.classList.add('hidden');
    } else {
        candidateNav.classList.add('hidden');
        adminNav.classList.remove('hidden');
    }

    showSection('welcome');
}

// Add this helper to prevent direct access to admin sections without password
function requireAdminAccess(sectionId) {
    if (currentMode !== 'admin') {
        showError('Admin access required.');
        showSection('welcome');
        return false;
    }
    return true;
}

function showSection(sectionId) {
    if (['questionEditor', 'analytics'].includes(sectionId) && !requireAdminAccess(sectionId)) {
        return;
    }

    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const activeNav = currentMode === 'candidate' ? 'candidateNavigation' : 'adminNavigation';
    document.querySelectorAll(`#${activeNav} .nav-btn`).forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    
    // Find and activate the correct nav button
    const navButtons = document.querySelectorAll(`#${activeNav} .nav-btn`);
    navButtons.forEach(btn => {
        const btnText = btn.textContent.toLowerCase();
        if ((sectionId === 'welcome' && btnText.includes('start')) ||
            (sectionId === 'questionEditor' && btnText.includes('edit')) ||
            (sectionId === 'test' && btnText.includes('test')) ||
            (sectionId === 'results' && btnText.includes('results')) ||
            (sectionId === 'analytics' && btnText.includes('analytics'))) {
            btn.classList.add('active');
        }
    });
    
    // Load data when entering specific sections
    if (sectionId === 'questionEditor') {
        loadQuestions().then(() => {
            updateQuestionsList();
        });
    } else if (sectionId === 'analytics' && currentMode === 'admin') {
        loadAnalyticsData();
    }
}

// Question Management Functions
async function addQuestion() {
    const category = document.getElementById('questionCategory').value;
    const weight = parseInt(document.getElementById('questionWeight').value);
    const text = document.getElementById('questionText').value.trim();
    const optionA = document.getElementById('optionA').value.trim();
    const optionB = document.getElementById('optionB').value.trim();
    const optionC = document.getElementById('optionC').value.trim();
    const optionD = document.getElementById('optionD').value.trim();
    const correctAnswer = document.getElementById('correctAnswer').value;
    
    if (!text || !optionA || !optionB || !optionC || !optionD) {
        showError('Please fill in all fields');
        return;
    }
    
    const questionData = {
        category,
        weight,
        text,
        options: { A: optionA, B: optionB, C: optionC, D: optionD },
        correctAnswer
    };
    
    const editingId = document.getElementById('editingQuestionId').value;
    
    try {
        if (editingId) {
            await updateQuestion(editingId, questionData);
            showSuccess('Question updated successfully!');
        } else {
            await saveQuestion(questionData);
            showSuccess('Question added successfully!');
        }
        
        await loadQuestions();
        updateQuestionsList();
        clearForm();
    } catch (error) {
        showError(error.message);
    }
}

function clearForm() {
    document.getElementById('questionText').value = '';
    document.getElementById('optionA').value = '';
    document.getElementById('optionB').value = '';
    document.getElementById('optionC').value = '';
    document.getElementById('optionD').value = '';
    document.getElementById('questionCategory').value = 'probability_stats';
    document.getElementById('questionWeight').value = '1';
    document.getElementById('correctAnswer').value = 'A';
    document.getElementById('editingQuestionId').value = '';
}

function editQuestion(questionId) {
    const question = allQuestions.find(q => q.id == questionId);
    if (!question) return;
    
    document.getElementById('questionCategory').value = question.category;
    document.getElementById('questionWeight').value = question.weight;
    document.getElementById('questionText').value = question.text;
    document.getElementById('optionA').value = question.options.A;
    document.getElementById('optionB').value = question.options.B;
    document.getElementById('optionC').value = question.options.C;
    document.getElementById('optionD').value = question.options.D;
    document.getElementById('correctAnswer').value = question.correctAnswer;
    document.getElementById('editingQuestionId').value = questionId;
    
    document.getElementById('questionText').focus();
}

async function deleteQuestion(questionId) {
    if (!confirm('Are you sure you want to delete this question?')) {
        return;
    }
    
    try {
        await deleteQuestionAPI(questionId);
        await loadQuestions();
        updateQuestionsList();
        showSuccess('Question deleted successfully!');
    } catch (error) {
        showError(error.message);
    }
}

function updateQuestionsList(filterCategory = 'all') {
    const questionsList = document.getElementById('questionsList');
    
    if (allQuestions.length === 0) {
        questionsList.innerHTML = '<div class="loading">No questions available. Add questions using the form.</div>';
        return;
    }
    
    const filteredQuestions = filterCategory === 'all' 
        ? allQuestions 
        : allQuestions.filter(q => q.category === filterCategory);
    
    if (filteredQuestions.length === 0) {
        questionsList.innerHTML = '<div class="loading">No questions found for this category.</div>';
        return;
    }
    
    questionsList.innerHTML = filteredQuestions.map(q => `
        <div class="question-item">
            <div class="question-header">
                <span class="question-points">${q.weight} pts</span>
                <div class="question-actions">
                    <button onclick="editQuestion('${q.id}')">Edit</button>
                    <button onclick="deleteQuestion('${q.id}')">Delete</button>
                </div>
            </div>
            <div style="margin-bottom: 8px;"><strong>Category:</strong> ${categoryNames[q.category] || q.category}</div>
            <div style="margin-bottom: 8px;"><strong>Q:</strong> ${q.text}</div>
            <div style="font-size: 14px; color: #666;"><strong>Answer:</strong> ${q.correctAnswer}) ${q.options[q.correctAnswer]}</div>
        </div>
    `).join('');
}

function filterQuestions(category) {
    updateQuestionsList(category);
}

async function exportQuestions() {
    if (allQuestions.length === 0) {
        showError('No questions to export');
        return;
    }
    
    const dataStr = JSON.stringify(allQuestions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ml_questions_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

async function importQuestions(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const importedQuestions = JSON.parse(e.target.result);
            if (!Array.isArray(importedQuestions)) {
                throw new Error('Invalid file format');
            }
            
            if (confirm('This will replace all current questions. Continue?')) {
                // Send each question to the API
                for (const question of importedQuestions) {
                    await saveQuestion(question);
                }
                
                await loadQuestions();
                updateQuestionsList();
                showSuccess('Questions imported successfully!');
            }
        } catch (error) {
            showError('Error importing questions. Please check the file format.');
        }
    };
    reader.readAsText(file);
    
    event.target.value = '';
}

async function resetToDefault() {
    if (!confirm('This will reset all questions to the default set. This cannot be undone. Continue?')) {
        return;
    }
    
    try {
        const response = await apiRequest('/questions/reset', { method: 'POST' });
        await loadQuestions();
        updateQuestionsList();
        clearForm();
        showSuccess('Questions reset to default successfully!');
    } catch (error) {
        showError('Failed to reset questions');
    }
}

// Test Functions
async function startGeneralTest() {
    // Check if test already taken
    const testTaken = localStorage.getItem('testTaken');
    if (testTaken === 'true') {
        showError('You have already taken the test. Only one attempt is allowed.');
        return;
    }

    // Prompt for name
    userName = prompt('Please enter your name:');
    if (!userName || userName.trim() === '') {
        showError('Name is required to start the test.');
        return;
    }

    if (allQuestions.length === 0) {
        await loadQuestions();
        if (allQuestions.length === 0) {
            showError('No questions available. Please contact administrator.');
            return;
        }
    }
    
    currentTest = [...allQuestions];
    currentTest = currentTest.sort(() => Math.random() - 0.5);
    
    currentQuestionIndex = 0;
    userAnswers = {};
    timeLeft = 3600; // 60 minutes
    
    showSection('test');
    showQuestion(currentQuestionIndex);
    startTimer();
    
    document.getElementById('submitTest').style.display = 'block';
    
    document.getElementById('testTitle').textContent = 'ML Engineer Assessment';
    document.getElementById('testDescription').textContent = 
        `${currentTest.length} questions • 60 minutes • All ML areas covered`;
}

function showQuestion(index) {
    const testContainer = document.getElementById('testQuestions');
    const question = currentTest[index];
    
    if (!question) {
        testContainer.innerHTML = '<p>No questions available.</p>';
        return;
    }
    
    testContainer.innerHTML = `
        <div class="question-card">
            <div class="question-number">${index + 1}</div>
            <h3>Question ${index + 1} of ${currentTest.length}</h3>
            <div style="margin: 10px 0;">
                <span style="background: #667eea; color: white; padding: 5px 15px; border-radius: 15px; font-size: 12px; font-weight: 600;">${question.weight} points</span>
            </div>
            <p style="font-size: 1.1rem; margin: 20px 0;">${question.text}</p>
            
            <div class="answer-options">
                ${Object.entries(question.options).map(([key, value]) => `
                    <label class="answer-option ${userAnswers[question.id] === key ? 'selected' : ''}" onclick="selectAnswer('${question.id}', '${key}')">
                        <input type="radio" name="q${question.id}" value="${key}" ${userAnswers[question.id] === key ? 'checked' : ''}>
                        <strong>${key})</strong> ${value}
                    </label>
                `).join('')}
            </div>
            
            <div style="margin-top: 30px; display: flex; justify-content: space-between;">
                <button class="btn" onclick="previousQuestion()" ${index === 0 ? 'disabled' : ''}>← Previous</button>
                <button class="btn" onclick="nextQuestion()">
                    ${index === currentTest.length - 1 ? 'Review & Submit' : 'Next →'}
                </button>
            </div>
        </div>
    `;
    
    updateProgress();
}

function selectAnswer(questionId, answer) {
    userAnswers[questionId] = answer;
    
    // Find the label that was clicked
    const labels = document.querySelectorAll('.answer-option');
    labels.forEach(label => {
        label.classList.remove('selected');
        if (label.querySelector(`input[value="${answer}"]`)) {
            label.classList.add('selected');
        }
    });
}

function nextQuestion() {
    if (currentQuestionIndex < currentTest.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    } else {
        if (confirm('Ready to submit your test? You can still go back to review your answers.')) {
            submitTest();
        }
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / currentTest.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

function startTimer() {
    clearInterval(testTimer);
    testTimer = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const timerEl = document.getElementById('timer');
        if (timeLeft <= 300) {
            timerEl.style.background = '#dc3545';
        } else if (timeLeft <= 600) {
            timerEl.style.background = '#ffc107';
            timerEl.style.color = '#000';
        }
        
        if (timeLeft <= 0) {
            clearInterval(testTimer);
            alert('Time is up! Submitting test automatically.');
            submitTest();
        }
    }, 1000);
}

async function submitTest() {
    clearInterval(testTimer);
    
    let score = 0;
    let maxScore = 0;
    const blockResults = {};
    const detailedAnswers = [];
    
    currentTest.forEach(question => {
        maxScore += question.weight;
        const userAnswer = userAnswers[question.id];
        const isCorrect = userAnswer === question.correctAnswer;
        
        if (isCorrect) {
            score += question.weight;
        }
        
        const block = question.category;
        if (!blockResults[block]) {
            blockResults[block] = { correct: 0, total: 0, maxPoints: 0, earnedPoints: 0 };
        }
        blockResults[block].total++;
        blockResults[block].maxPoints += question.weight;
        if (isCorrect) {
            blockResults[block].correct++;
            blockResults[block].earnedPoints += question.weight;
        }

        detailedAnswers.push({
            questionId: question.id,
            questionText: question.text,
            category: question.category,
            userAnswer: userAnswer || null,
            correctAnswer: question.correctAnswer,
            isCorrect: isCorrect
        });
    });
    
    const percentage = Math.round((score / maxScore) * 100);
    const timeUsed = 3600 - timeLeft;
    
    let grade = 'Poor';
    let gradeClass = 'grade-poor';
    if (percentage >= 90) {
        grade = 'Excellent';
        gradeClass = 'grade-excellent';
    } else if (percentage >= 75) {
        grade = 'Good';
        gradeClass = 'grade-good';
    } else if (percentage >= 60) {
        grade = 'Fair';
        gradeClass = 'grade-fair';
    }
    
    const result = {
        timestamp: new Date().toISOString(),
        score,
        maxScore,
        percentage,
        grade,
        gradeClass,
        timeUsed: `${Math.floor(timeUsed / 60)}:${(timeUsed % 60).toString().padStart(2, '0')}`,
        answers: userAnswers,
        detailedAnswers: detailedAnswers, // Added detailed answers
        questions: currentTest.length,
        blockResults,
        userName: userName.trim()
    };
    
    // Save results to server
    await submitTestResults(result);
    
    // Mark test as taken
    localStorage.setItem('testTaken', 'true');
    
    testResults.push(result);
    showResults(result);
    showSection('results');
}

function showResults(result) {
    let detailedResults = Object.entries(result.blockResults).map(([block, blockResult]) => `
        <div class="result-block">
            <h4>${categoryNames[block] || block}</h4>
            <p><strong>Correct:</strong> ${blockResult.correct}/${blockResult.total} questions</p>
            <p><strong>Points:</strong> ${blockResult.earnedPoints}/${blockResult.maxPoints}</p>
            <p><strong>Block Score:</strong> ${Math.round((blockResult.earnedPoints / blockResult.maxPoints) * 100)}%</p>
        </div>
    `).join('');
                        
    document.getElementById('resultsContent').innerHTML = `
        <div class="results-summary">
            <div class="score-display">${result.score}/${result.maxScore}</div>
            <div style="font-size: 1.5rem; color: #666; margin-bottom: 10px;">${result.percentage}% Score</div>
            <div class="grade-badge ${result.gradeClass}">${result.grade}</div>
            <p style="margin-top: 20px; color: #666;">
                <strong>ML Engineer Assessment for ${result.userName}</strong> <br>
                <strong>Time Used:</strong> ${result.timeUsed} <br>
                <strong>Completed:</strong> ${new Date(result.timestamp).toLocaleString()}
            </p>
        </div>
        
        <div class="detailed-results">
            <h3>Performance by Area</h3>
            ${detailedResults}
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            ${currentMode === 'admin' ? '<button class="btn" onclick="showSection(\'welcome\')">Back to Welcome</button>' : '<p>You have completed the test. Thank you!</p>'}
            ${currentMode === 'admin' ? '<button class="btn" onclick="showSection(\'analytics\')" style="margin-left: 10px;">View Analytics</button>' : ''}
        </div>
    `;
}

// Analytics Functions
async function loadAnalyticsData() {
    const analyticsContent = document.getElementById('analyticsContent');
    analyticsContent.innerHTML = '<div class="loading">Loading analytics data...</div>';
    
    try {
        const data = await loadAnalytics();
        if (data) {
            displayAnalytics(data);
        } else {
            analyticsContent.innerHTML = '<p>No analytics data available yet.</p>';
        }
    } catch (error) {
        analyticsContent.innerHTML = '<p>Failed to load analytics data.</p>';
    }
}

function displayAnalytics(data) {
    const analyticsContent = document.getElementById('analyticsContent');
    
    analyticsContent.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div class="result-block">
                <h4>Total Tests Taken</h4>
                <div style="font-size: 2rem; font-weight: 700; color: #667eea;">${data.totalTests || 0}</div>
            </div>
            <div class="result-block">
                <h4>Average Score</h4>
                <div style="font-size: 2rem; font-weight: 700; color: #667eea;">${data.averageScore || 0}%</div>
            </div>
            <div class="result-block">
                <h4>Total Questions</h4>
                <div style="font-size: 2rem; font-weight: 700; color: #667eea;">${data.totalQuestions || 0}</div>
            </div>
            <div class="result-block">
                <h4>Pass Rate</h4>
                <div style="font-size: 2rem; font-weight: 700; color: #667eea;">${data.passRate || 0}%</div>
            </div>
        </div>
        
        <div class="detailed-results">
            <h3>Recent Test Results</h3>
            ${data.recentResults ? data.recentResults.map(result => `
                <div class="result-block">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${result.userName || 'Anonymous'}: ${result.score}/${result.maxScore} (${result.percentage}%)</strong>
                            <div style="color: #666; font-size: 0.9rem;">${new Date(result.timestamp).toLocaleString()}</div>
                        </div>
                        <div class="grade-badge ${result.gradeClass}" style="margin: 0; padding: 5px 15px; font-size: 0.9rem;">
                            ${result.grade}
                        </div>
                    </div>
                </div>
            `).join('') : '<p>No recent results available.</p>'}
        </div>
    `;
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (document.getElementById('test').classList.contains('active') && currentTest.length > 0) {
        if (e.key === 'ArrowLeft' && currentQuestionIndex > 0) {
            previousQuestion();
        } else if (e.key === 'ArrowRight' && currentQuestionIndex < currentTest.length - 1) {
            nextQuestion();
        } else if (e.key >= '1' && e.key <= '4') {
            const letters = ['A', 'B', 'C', 'D'];
            const answer = letters[parseInt(e.key) - 1];
            if (currentTest[currentQuestionIndex]) {
                selectAnswer(currentTest[currentQuestionIndex].id, answer);
            }
        }
    }
});

// Initialize the application
async function initializeApp() {
    setMode('candidate');
    showSection('welcome');
    await loadQuestions();
    
    // Optionally hide admin button by default (uncomment if you added data-mode to HTML)
    // const adminButton = document.querySelector('.mode-btn[data-mode="admin"]');
    // if (adminButton) {
    //     adminButton.style.display = 'none';
    // }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeApp);


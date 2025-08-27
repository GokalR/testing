// =================================================================================
// Configuration & Global State
// =================================================================================

const API_BASE_URL = '/api';
const ADMIN_PASSWORD = 'botabotabotaspeed'; // Change this to a secure password!
const TEST_DURATION_SECONDS = 3600; // 60 minutes

// Global variables
let currentMode = 'candidate';
let allQuestions = [];
let currentTest = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let testTimer;
let timeLeft = TEST_DURATION_SECONDS;
let testResultId = null; // To store the ID of the current test result for updates
let userName = '';

// Data Mappings
const categoryNames = {
    probability_stats: 'Probability & Statistics',
    ml_algorithms: 'ML Algorithms',
    data_preparation: 'Data Preparation & Feature Engineering',
    validation_metrics: 'Validation & Metrics',
    coding: 'Coding',
    soft_communication: 'Soft Skills: Communication',
    soft_teamwork: 'Soft Skills: Teamwork',
    soft_selforg: 'Soft Skills: Self-Organization',
    soft_feedback: 'Soft Skills: Feedback',
    soft_creativity: 'Soft Skills: Creativity',
    soft_documentation: 'Soft Skills: Documentation'
};

const levels = [
    { name: 'Below Junior', min: 0, max: 5 },
    { name: 'Junior', min: 6, max: 24 },
    { name: 'Middle', min: 25, max: 54 },
    { name: 'Senior', min: 55, max: 79 },
    { name: 'Senior+', min: 80, max: 99 },
    { name: 'Tech Lead', min: 100, max: 104 },
    { name: 'Head of', min: 105, max: Infinity }
];

// =================================================================================
// API Functions
// =================================================================================

async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: { 'Content-Type': 'application/json', ...options.headers },
            ...options
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
            throw new Error(err.error);
        }
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        showError(`Network error: ${error.message}. Please check your connection.`);
        throw error;
    }
}

const loadQuestions = () => apiRequest('/questions');
const saveQuestion = (question) => apiRequest('/questions', { method: 'POST', body: JSON.stringify(question) });
const updateQuestion = (id, question) => apiRequest(`/questions/${id}`, { method: 'PUT', body: JSON.stringify(question) });
const deleteQuestionAPI = (id) => apiRequest(`/questions/${id}`, { method: 'DELETE' });
const resetQuestionsAPI = () => apiRequest('/questions/reset', { method: 'POST' });
const submitTestResults = (results) => apiRequest('/results', { method: 'POST', body: JSON.stringify(results) });
const updateTestResult = (id, updateData) => apiRequest(`/results/${id}`, { method: 'PUT', body: JSON.stringify(updateData) });
const loadAnalytics = () => apiRequest('/analytics');

// =================================================================================
// UI Helper Functions
// =================================================================================

function showError(message) {
    const existing = document.querySelector('.error');
    if (existing) existing.remove();
    const div = document.createElement('div');
    div.className = 'error';
    div.textContent = message;
    document.body.insertBefore(div, document.body.firstChild);
    setTimeout(() => div.remove(), 5000);
}

function showSuccess(message) {
    const existing = document.querySelector('.success');
    if (existing) existing.remove();
    const div = document.createElement('div');
    div.className = 'success';
    div.textContent = message;
    document.body.insertBefore(div, document.body.firstChild);
    setTimeout(() => div.remove(), 3000);
}

function updateWelcomeStats() {
    document.getElementById('totalQuestions').textContent = allQuestions.length;
    document.getElementById('totalPoints').textContent = allQuestions.reduce((sum, q) => sum + q.weight, 0);

    const categoryCounts = allQuestions.reduce((acc, q) => {
        acc[q.category] = (acc[q.category] || 0) + 1;
        return acc;
    }, {});

    const coverageHTML = Object.entries(categoryCounts)
        .map(([category, count]) => `<li><strong>${categoryNames[category] || category}:</strong> ${count} questions</li>`)
        .join('');
    document.getElementById('coverageAreas').innerHTML = coverageHTML || '<li>No questions loaded.</li>';
}

// =================================================================================
// Mode and Navigation
// =================================================================================

function setMode(mode) {
    if (mode === 'admin') {
        const pass = prompt('Enter Administrator Password:');
        if (pass !== ADMIN_PASSWORD) {
            showError('Incorrect password.');
            return;
        }
    }

    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.mode-btn[onclick="setMode('${mode}')"]`).classList.add('active');

    document.getElementById('candidateNavigation').classList.toggle('hidden', mode !== 'candidate');
    document.getElementById('adminNavigation').classList.toggle('hidden', mode !== 'admin');

    showSection('welcome'); // Default to welcome section on mode change
}

function requireAdminAccess(sectionId) {
    if (currentMode !== 'admin') {
        showError('Administrator access required for this section.');
        showSection('welcome');
        return false;
    }
    return true;
}

function showSection(sectionId) {
    if (['questionEditor', 'analytics'].includes(sectionId) && !requireAdminAccess(sectionId)) {
        return;
    }

    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    const navId = currentMode === 'admin' ? 'adminNavigation' : 'candidateNavigation';
    document.querySelectorAll(`#${navId} .nav-btn`).forEach(btn => btn.classList.remove('active'));
    document.querySelector(`#${navId} .nav-btn[onclick="showSection('${sectionId}')"]`)?.classList.add('active');

    // Load data for specific sections
    if (sectionId === 'questionEditor') {
        updateQuestionsList();
    } else if (sectionId === 'analytics') {
        loadAnalyticsData();
    }
}

// =================================================================================
// Question Management (Admin)
// =================================================================================

/** [NEW] Toggles form fields based on the selected question type. */
function toggleQuestionTypeFields() {
    const type = document.getElementById('questionType').value;
    document.getElementById('multipleChoiceFields').classList.toggle('hidden', type !== 'multiple');
    document.getElementById('codingFields').classList.toggle('hidden', type !== 'code');
}

/** [UPDATED] Handles adding or updating a question. */
async function addOrUpdateQuestion() {
    const editingId = document.getElementById('editingQuestionId').value;
    const questionData = {
        type: document.getElementById('questionType').value,
        category: document.getElementById('questionCategory').value,
        weight: parseInt(document.getElementById('questionWeight').value, 10) || 1,
        text: document.getElementById('questionText').value.trim(),
        options: {},
        correctAnswer: null,
        test_cases: ''
    };

    if (questionData.type === 'multiple') {
        questionData.options = {
            A: document.getElementById('optionA').value.trim(), B: document.getElementById('optionB').value.trim(),
            C: document.getElementById('optionC').value.trim(), D: document.getElementById('optionD').value.trim()
        };
        questionData.correctAnswer = document.getElementById('correctAnswer').value;
        if (!questionData.options.A || !questionData.options.B) {
            return showError('Options A and B are required for multiple choice questions.');
        }
    } else if (questionData.type === 'code') {
        questionData.test_cases = document.getElementById('testCases').value.trim();
    }

    if (!questionData.text) return showError('Question text cannot be empty.');

    try {
        const action = editingId ? updateQuestion(editingId, questionData) : saveQuestion(questionData);
        await action;
        showSuccess(`Question ${editingId ? 'updated' : 'added'} successfully!`);
        clearForm();
        const data = await loadQuestions(); // Reload all questions
        allQuestions = data.questions || [];
        updateQuestionsList();
    } catch (error) {
        showError(`Failed to save question: ${error.message}`);
    }
}

/** [UPDATED] Clears the question editor form. */
function clearForm() {
    document.getElementById('editingQuestionId').value = '';
    document.getElementById('questionType').value = 'multiple';
    document.getElementById('questionCategory').value = 'probability_stats';
    document.getElementById('questionWeight').value = '1';
    document.getElementById('questionText').value = '';
    document.getElementById('optionA').value = '';
    document.getElementById('optionB').value = '';
    document.getElementById('optionC').value = '';
    document.getElementById('optionD').value = '';
    document.getElementById('correctAnswer').value = 'A';
    document.getElementById('testCases').value = '';
    document.getElementById('formTitle').textContent = 'Add New Question';
    toggleQuestionTypeFields();
}

/** [UPDATED] Populates the form to edit a question. */
function editQuestion(questionId) {
    const question = allQuestions.find(q => q.id === questionId);
    if (!question) return showError('Question not found.');

    document.getElementById('editingQuestionId').value = question.id;
    document.getElementById('formTitle').textContent = `Editing Question...`;
    document.getElementById('questionType').value = question.type;
    document.getElementById('questionCategory').value = question.category;
    document.getElementById('questionWeight').value = question.weight;
    document.getElementById('questionText').value = question.text;

    if (question.type === 'multiple') {
        document.getElementById('optionA').value = question.options.A || '';
        document.getElementById('optionB').value = question.options.B || '';
        document.getElementById('optionC').value = question.options.C || '';
        document.getElementById('optionD').value = question.options.D || '';
        document.getElementById('correctAnswer').value = question.correctAnswer || 'A';
    } else if (question.type === 'code') {
        document.getElementById('testCases').value = question.test_cases || '';
    }

    toggleQuestionTypeFields();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteQuestion(questionId) {
    if (confirm(`Are you sure you want to delete question ID: ${questionId}?`)) {
        try {
            await deleteQuestionAPI(questionId);
            showSuccess('Question deleted.');
            allQuestions = allQuestions.filter(q => q.id !== questionId);
            updateQuestionsList();
        } catch (error) {
            showError(`Failed to delete question: ${error.message}`);
        }
    }
}

async function resetToDefault() {
    if (confirm('This will delete all custom questions and restore the default set. Are you sure?')) {
        try {
            await resetQuestionsAPI();
            showSuccess('Questions have been reset.');
            const data = await loadQuestions();
            allQuestions = data.questions || [];
            updateWelcomeStats();
            updateQuestionsList();
        } catch (error) {
            showError(`Failed to reset questions: ${error.message}`);
        }
    }
}

/** [PERFORMANCE FIX] Efficiently renders the question list. */
function updateQuestionsList() {
    const listEl = document.getElementById('questionsList');
    const filter = document.getElementById('categoryFilter').value;
    const filtered = allQuestions.filter(q => filter === 'all' || q.category === filter);

    if (filtered.length === 0) {
        listEl.innerHTML = `<div class="loading">No questions found.</div>`;
        return;
    }
    const html = filtered.map(q => `
        <div class="question-item">
            <div class="question-header">
                <strong>${q.type.charAt(0).toUpperCase() + q.type.slice(1)}: ${categoryNames[q.category] || q.category}</strong>
                <span class="question-points">${q.weight} pt${q.weight > 1 ? 's' : ''}</span>
            </div>
            <p>${q.text.substring(0, 100)}${q.text.length > 100 ? '...' : ''}</p>
            <div class="question-actions">
                <button onclick="editQuestion('${q.id}')" data-i18n="editBtn">Edit</button>
                <button onclick="deleteQuestion('${q.id}')" data-i18n="deleteBtn">Delete</button>
            </div>
        </div>
    `).join('');
    listEl.innerHTML = html;
}

const filterQuestions = () => updateQuestionsList();

// =================================================================================
// Test Taking Flow
// =================================================================================

function startGeneralTest() {
    userName = prompt("Please enter your full name to begin the assessment:");
    if (!userName || userName.trim() === '') {
        return showError("A name is required to start the test.");
    }
    currentTest = [...allQuestions]; // Use all available questions
    currentQuestionIndex = 0;
    userAnswers = {};
    timeLeft = TEST_DURATION_SECONDS;
    testResultId = null;
    showSection('test');
    document.getElementById('submitTest').style.display = 'block';
    renderQuestion();
    startTimer();
}

function renderQuestion() {
    const question = currentTest[currentQuestionIndex];
    const container = document.getElementById('testQuestions');
    let optionsHTML = '';

    if (question.type === 'multiple') {
        optionsHTML = `<div class="answer-options">` +
            Object.entries(question.options).map(([key, value]) => `
                <div class="answer-option ${userAnswers[question.id] === key ? 'selected' : ''}" onclick="selectAnswer('${question.id}', '${key}')">
                    <input type="radio" name="q${question.id}" value="${key}" ${userAnswers[question.id] === key ? 'checked' : ''} style="display:none;">
                    <strong>${key})</strong> <label>${value}</label>
                </div>
            `).join('') + `</div>`;
    } else if (question.type === 'open' || question.type === 'code') {
        optionsHTML = `
            <textarea class="form-group" style="min-height: 200px;" oninput="selectAnswer('${question.id}', this.value)" 
            placeholder="Enter your ${question.type === 'code' ? 'code or solution' : 'answer'} here...">${userAnswers[question.id] || ''}</textarea>
            ${question.type === 'code' && question.test_cases ? `<div class="test-cases"><strong>Test Cases:</strong><pre>${question.test_cases}</pre></div>` : ''}
        `;
    }

    container.innerHTML = `
        <div class="question-card">
            <div class="question-number">${currentQuestionIndex + 1}</div>
            <p style="font-size: 1.2rem; font-weight: 500;">${question.text}</p>
            ${optionsHTML}
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <button class="btn btn-secondary" onclick="previousQuestion()" ${currentQuestionIndex === 0 ? 'disabled' : ''}>Previous</button>
            <button class="btn" onclick="nextQuestion()">${currentQuestionIndex === currentTest.length - 1 ? 'Review & Finish' : 'Next'}</button>
        </div>
    `;
    updateProgress();
}

function selectAnswer(questionId, answer) {
    userAnswers[questionId] = answer;
    // Re-render to update UI state, which is simple and effective for this app size
    renderQuestion();
}

const nextQuestion = () => {
    if (currentQuestionIndex < currentTest.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        submitTest();
    }
};

const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
};

const updateProgress = () => {
    const answeredCount = Object.keys(userAnswers).length;
    document.getElementById('progressFill').style.width = `${(answeredCount / currentTest.length) * 100}%`;
};

function startTimer() {
    clearInterval(testTimer);
    const timerEl = document.getElementById('timer');
    testTimer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(testTimer);
            showError('Time is up! Your test will be submitted automatically.');
            submitTest();
        }
    }, 1000);
}

async function submitTest() {
    if (!confirm('Are you sure you want to finish and submit your test?')) return;
    clearInterval(testTimer);

    let score = 0;
    const maxScore = allQuestions.reduce((sum, q) => sum + q.weight, 0);
    const detailedAnswers = allQuestions.map(q => {
        const userAnswer = userAnswers[q.id];
        const isCorrect = q.type === 'multiple' && userAnswer === q.correctAnswer;
        if (isCorrect) score += q.weight;
        return { questionId: q.id, text: q.text, type: q.type, category: q.category, userAnswer: userAnswer || null, correctAnswer: q.correctAnswer, isCorrect };
    });

    const level = levels.find(l => score >= l.min && score <= l.max)?.name || 'N/A';
    
    const result = {
        userName: userName.trim(),
        timestamp: new Date().toISOString(),
        score,
        maxScore,
        percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
        level,
        detailedAnswers,
    };
    
    try {
        const response = await submitTestResults(result);
        testResultId = response.id;
        showSuccess('Test submitted successfully!');
        showResults(result);
    } catch (error) {
        showError('Could not submit test results. Please check your connection.');
    }
}

// =================================================================================
// Results & Analytics
// =================================================================================

function showResults(result) {
    const grade = result.percentage >= 80 ? { text: 'Excellent', class: 'grade-excellent' }
        : result.percentage >= 60 ? { text: 'Good', class: 'grade-good' }
        : result.percentage >= 40 ? { text: 'Fair', class: 'grade-fair' }
        : { text: 'Needs Improvement', class: 'grade-poor' };

    const blockResults = result.detailedAnswers.reduce((acc, ans) => {
        const cat = ans.category;
        if (!acc[cat]) acc[cat] = { correct: 0, total: 0 };
        if (ans.isCorrect) acc[cat].correct++;
        acc[cat].total++;
        return acc;
    }, {});
    
    document.getElementById('resultsContent').innerHTML = `
        <div class="results-summary">
            <h3>${result.userName}</h3>
            <div class="score-display">${result.score} / ${result.maxScore}</div>
            <div class="grade-badge ${grade.class}">${result.percentage}% - ${result.level} (${grade.text})</div>
        </div>
        <h4>Breakdown by Category:</h4>
        <div class="detailed-results">
            ${Object.entries(blockResults).map(([cat, res]) => `
                <div class="result-block">
                    <strong>${categoryNames[cat] || cat}:</strong> ${res.correct} / ${res.total} correct
                </div>
            `).join('')}
        </div>
    `;
    showSection('results');
}

async function loadAnalyticsData() {
    const content = document.getElementById('analyticsContent');
    content.innerHTML = `<div class="loading">Loading analytics...</div>`;
    try {
        const data = await loadAnalytics();
        displayAnalytics(data);
    } catch (error) {
        content.innerHTML = `<p>Failed to load analytics data.</p>`;
    }
}

function displayAnalytics(data) {
    document.getElementById('analyticsContent').innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div class="result-block"><h4>Total Tests</h4><div class="score-display">${data.totalTests}</div></div>
            <div class="result-block"><h4>Average Score</h4><div class="score-display">${data.averageScore}%</div></div>
            <div class="result-block"><h4>Pass Rate (>=60%)</h4><div class="score-display">${data.passRate}%</div></div>
        </div>
        <h3>Recent Results</h3>
        <div class="detailed-results">
        ${data.recentResults.map(r => `
            <div class="result-block">
                <strong>${r.userName}</strong>: ${r.score}/${r.maxScore} (${r.percentage}%) - ${r.level}
                <div style="font-size: 0.8rem; color: #666;">${new Date(r.timestamp).toLocaleString()}</div>
            </div>`).join('') || '<p>No recent results found.</p>'}
        </div>
    `;
}

// =================================================================================
// Initialization
// =================================================================================

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('questionType').addEventListener('change', toggleQuestionTypeFields);
    initializeApp();
});

async function initializeApp() {
    setMode('candidate');
    showSection('welcome');
    try {
        const data = await loadQuestions();
        allQuestions = data.questions || [];
        updateWelcomeStats();
        
        const categoryFilter = document.getElementById('categoryFilter');
        categoryFilter.innerHTML = `<option value="all">All Categories</option>` + 
            Object.entries(categoryNames).map(([val, name]) => `<option value="${val}">${name}</option>`).join('');
    } catch (error) {
        showError("Failed to initialize the application by loading questions.");
    }
}

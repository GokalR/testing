// =================================================================================
// Configuration & Global State
// =================================================================================

const API_BASE_URL = '/api';
const ADMIN_PASSWORD = 'bota13'; // Change this to a secure password!
const TEST_DURATION_SECONDS = 900; // 15 minutes

// ... (Global variables, Data Mappings, translations remain unchanged) ...
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

const hardSkillCategories = ['probability_stats', 'ml_algorithms', 'data_preparation', 'validation_metrics', 'coding'];
const softSkillCategories = ['soft_communication', 'soft_teamwork', 'soft_selforg', 'soft_feedback', 'soft_creativity', 'soft_documentation'];

const levels = [
    { name: 'Below Junior', min: 0, max: 5 },
    { name: 'Junior', min: 6, max: 24 },
    { name: 'Middle', min: 25, max: 54 },
    { name: 'Senior', min: 55, max: 79 },
    { name: 'Senior+', min: 80, max: 99 },
    { name: 'Tech Lead', min: 100, max: 104 },
    { name: 'Head of', min: 105, max: Infinity }
];

const translations = {
    en: {
        mainTitle: "ML Engineer Testing Platform",
        mainSubtitle: "Quick testing system for Machine Learning professionals",
        candidateMode: "Candidate Mode",
        adminMode: "Administrator Mode",
        navStartTest: "Start Test",
        navResults: "Results",
        navEditQuestions: "Edit Questions",
        navAnalytics: "Analytics",
        welcomeTitle: "Hard Skills Assessment",
        welcomeSubtitle: "Quick evaluation covering essential ML algorithms & Statistics",
        overviewTitle: "Test Overview",
        overviewQuestions: "Questions",
        overviewMinutes: "Minutes",
        overviewPoints: "Total Points",
        coverageTitle: "Coverage Areas:",
        loadingCoverage: "Loading test information...",
        instructionsTitle: "Instructions:",
        instruction1: "You have 15 minutes to complete all questions",
        instruction2: "Each question has one correct answer",
        instruction3: "You can navigate between questions and change answers",
        instruction4: "Questions are weighted by difficulty (1, 3, or 5 points)",
        instruction5: "Your progress will be automatically saved",
        beginAssessment: "Begin Assessment",
        allowRetake: "Allow Retake for This User",
        qEditorTitle: "Question Management",
        qEditorAddTitle: "Add New Question",
        qEditorType: "Question Type:",
        qEditorCategory: "Category:",
        qEditorWeight: "Weight (Points):",
        qEditorText: "Question Text:",
        qEditorOptA: "Option A:",
        qEditorOptB: "Option B:",
        qEditorOptC: "Option C:",
        qEditorOptD: "Option D:",
        qEditorCorrect: "Correct Answer:",
        qEditorTestCases: "Test Cases:",
        qEditorAddBtn: "Save Question",
        qBankTitle: "Question Bank",
        qBankFilter: "Filter by Category:",
        qBankAllCat: "All Categories",
        loadingQuestions: "Loading questions...",
        qBankExport: "Export Questions",
        qBankImport: "Import Questions",
        qBankReset: "Reset to Default",
        testTitle: "Hard Skills Assessment",
        testSubtitle: "Answer all questions within the time limit",
        testStartFromWelcome: "Please start the test from the welcome section.",
        submitTestBtn: "Submit Test",
        resultsTitle: "Test Results",
        resultsCompleteTest: "Complete a test to see your results here.",
        analyticsTitle: "Performance Analytics",
        loadingAnalytics: "Loading analytics data...",
        editBtn: "Edit",
        deleteBtn: "Delete"
    },
    // We keep RU for compatibility, but updated to reflect "Quick" if user switches
    ru: {
        mainTitle: "Платформа для тестирования ML-инженеров",
        mainSubtitle: "Система быстрого тестирования для специалистов по машинному обучению",
        candidateMode: "Режим кандидата",
        adminMode: "Режим администратора",
        navStartTest: "Начать тест",
        navResults: "Результаты",
        navEditQuestions: "Редактировать вопросы",
        navAnalytics: "Аналитика",
        welcomeTitle: "Оценка Hard Skills",
        welcomeSubtitle: "Быстрая оценка, охватывающая основные алгоритмы ML и статистику",
        overviewTitle: "Обзор теста",
        overviewQuestions: "Вопросы",
        overviewMinutes: "Минуты",
        overviewPoints: "Всего баллов",
        coverageTitle: "Охватываемые области:",
        loadingCoverage: "Загрузка информации о тесте...",
        instructionsTitle: "Инструкции:",
        instruction1: "У вас есть 15 минут, чтобы ответить на все вопросы",
        instruction2: "У каждого вопроса один правильный ответ",
        instruction3: "Вы можете переключаться между вопросами и изменять ответы",
        instruction4: "Вопросы оцениваются по сложности (1, 3 или 5 баллов)",
        instruction5: "Ваш прогресс будет автоматически сохранен",
        beginAssessment: "Начать оценку",
        allowRetake: "Разрешить пересдачу для этого пользователя",
        qEditorTitle: "Управление вопросами",
        qEditorAddTitle: "Добавить новый вопрос",
        qEditorType: "Тип вопроса:",
        qEditorCategory: "Категория:",
        qEditorWeight: "Вес (баллы):",
        qEditorText: "Текст вопроса:",
        qEditorOptA: "Вариант A:",
        qEditorOptB: "Вариант B:",
        qEditorOptC: "Вариант C:",
        qEditorOptD: "Вариант D:",
        qEditorCorrect: "Правильный ответ:",
        qEditorTestCases: "Тестовые случаи:",
        qEditorAddBtn: "Сохранить вопрос",
        qBankTitle: "Банк вопросов",
        qBankFilter: "Фильтр по категориям:",
        qBankAllCat: "Все категории",
        loadingQuestions: "Загрузка вопросов...",
        qBankExport: "Экспорт вопросов",
        qBankImport: "Импорт вопросов",
        qBankReset: "Сбросить по умолчанию",
        testTitle: "Оценка Hard Skills",
        testSubtitle: "Ответьте на все вопросы в течение установленного времени",
        testStartFromWelcome: "Пожалуйста, начните тест из раздела приветствия.",
        submitTestBtn: "Отправить тест",
        resultsTitle: "Результаты теста",
        resultsCompleteTest: "Завершите тест, чтобы увидеть здесь свои результаты.",
        analyticsTitle: "Аналитика производительности",
        loadingAnalytics: "Загрузка данных аналитики...",
        editBtn: "Ред.",
        deleteBtn: "Удал."
    }
};

// =================================================================================
// Language Functions
// =================================================================================
function setLanguage(lang) {
    const langData = translations[lang];
    if (!langData) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (langData[key]) {
            el.textContent = langData[key];
        }
    });
    
    document.querySelectorAll('.lang-switcher button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');

    localStorage.setItem('language', lang);
}

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
const replaceQuestionsAPI = (questions) => apiRequest('/questions/replace', { method: 'POST', body: JSON.stringify(questions) });
const submitTestResults = (results) => apiRequest('/results', { method: 'POST', body: JSON.stringify(results) });
const gradeQuestionAPI = (resultId, questionId, pointsAwarded) => apiRequest(`/results/${resultId}`, { method: 'PUT', body: JSON.stringify({ questionId, pointsAwarded }) });
const loadAnalytics = () => apiRequest('/analytics');

// =================================================================================
// UI Helper Functions & Navigation & Test Flow
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
    const totalPoints = allQuestions.reduce((sum, q) => sum + q.weight, 0);
    document.getElementById('totalPoints').textContent = parseFloat(totalPoints.toFixed(2));

    const categoryCounts = allQuestions.reduce((acc, q) => {
        acc[q.category] = (acc[q.category] || 0) + 1;
        return acc;
    }, {});

    const coverageHTML = Object.entries(categoryCounts)
        .map(([category, count]) => `<li><strong>${categoryNames[category] || category}:</strong> ${count} questions</li>`)
        .join('');
    document.getElementById('coverageAreas').innerHTML = coverageHTML || '<li>No questions loaded.</li>';
}

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

    showSection('welcome'); 
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
    
    const navButton = document.querySelector(`#adminNavigation .nav-btn[onclick="showSection('${sectionId}')"]`) || 
                      document.querySelector(`#candidateNavigation .nav-btn[onclick="showSection('${sectionId}')"]`);
    if(navButton) navButton.classList.add('active');

    if (sectionId === 'questionEditor') {
        updateQuestionsList();
    } else if (sectionId === 'analytics') {
        loadAnalyticsData();
    }
}

// =================================================================================
// Question Management (Admin)
// =================================================================================

function toggleQuestionTypeFields() {
    const type = document.getElementById('questionType').value;
    document.getElementById('multipleChoiceFields').classList.toggle('hidden', type !== 'multiple');
    document.getElementById('codingFields').classList.toggle('hidden', type !== 'code');
}

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
        const data = await loadQuestions(); 
        allQuestions = data.questions || [];
        updateQuestionsList();
    } catch (error) {
        showError(`Failed to save question: ${error.message}`);
    }
}

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

function exportQuestions() {
    const dataStr = JSON.stringify(allQuestions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'questions.json';
    
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showSuccess('Exporting questions...');
}

function importQuestions(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const importedQuestions = JSON.parse(e.target.result);
            if (!Array.isArray(importedQuestions)) {
                throw new Error("Invalid format. File must contain a JSON array of questions.");
            }
            if (confirm(`Are you sure you want to replace all ${allQuestions.length} current questions with the ${importedQuestions.length} questions from this file? This cannot be undone.`)) {
                await replaceQuestionsAPI(importedQuestions);
                showSuccess(`${importedQuestions.length} questions imported successfully!`);
                allQuestions = importedQuestions;
                updateQuestionsList();
                updateWelcomeStats();
            }
        } catch (error) {
            showError(`Import failed: ${error.message}`);
        } finally {
            document.getElementById('importFile').value = '';
        }
    };
    reader.readAsText(file);
}

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
// Test Taking Flow, Results & Analytics
// =================================================================================

function startGeneralTest() {
    // TRANSLATED to English
    userName = prompt("Please enter your full name to start the test:");
    if (!userName || userName.trim() === '') {
        return showError("You must enter a name to start the test.");
    }
    currentTest = [...allQuestions]; 
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
        // TRANSLATED placeholders to English
        optionsHTML = `
            <textarea class="form-group" style="min-height: 200px;" oninput="selectAnswer('${question.id}', this.value)" 
            placeholder="Enter your ${question.type === 'code' ? 'code or solution' : 'answer'} here...">${userAnswers[question.id] || ''}</textarea>
            ${question.type === 'code' && question.test_cases ? `<div class="test-cases"><strong>Test Cases:</strong><pre>${question.test_cases}</pre></div>` : ''}
        `;
    }

    // TRANSLATED buttons to English
    container.innerHTML = `
        <div class="question-card">
            <div class="question-number">${currentQuestionIndex + 1}</div>
            <p style="font-size: 1.2rem; font-weight: 500;">${question.text}</p>
            ${optionsHTML}
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <button class="btn btn-secondary" onclick="previousQuestion()" ${currentQuestionIndex === 0 ? 'disabled' : ''}>Back</button>
            <button class="btn" onclick="nextQuestion()">${currentQuestionIndex === currentTest.length - 1 ? 'Finish' : 'Next'}</button>
        </div>
    `;
    updateProgress();
}

function selectAnswer(questionId, answer) {
    userAnswers[questionId] = answer;
    const question = currentTest.find(q => q.id === questionId);
    
    if (question && question.type === 'multiple') {
        renderQuestion();
    }
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
            // TRANSLATED to English
            showError('Time is up! Your test will be submitted automatically.');
            submitTest();
        }
    }, 1000);
}

async function submitTest() {
    // TRANSLATED to English
    if (!confirm('Are you sure you want to finish and submit the test?')) return;
    clearInterval(testTimer);

    let score = 0;
    let hardSkillScore = 0;
    let softSkillScore = 0;

    const maxScore = allQuestions.reduce((sum, q) => sum + q.weight, 0);
    const maxHardSkillScore = allQuestions.filter(q => hardSkillCategories.includes(q.category)).reduce((sum, q) => sum + q.weight, 0);
    const maxSoftSkillScore = allQuestions.filter(q => softSkillCategories.includes(q.category)).reduce((sum, q) => sum + q.weight, 0);

    const detailedAnswers = allQuestions.map(q => {
        const userAnswer = userAnswers[q.id];
        const isCorrect = q.type === 'multiple' && userAnswer === q.correctAnswer;
        
        if (isCorrect) {
            score += q.weight;
            if (hardSkillCategories.includes(q.category)) {
                hardSkillScore += q.weight;
            } else if (softSkillCategories.includes(q.category)) {
                softSkillScore += q.weight;
            }
        }
        
        return { 
            questionId: q.id, 
            text: q.text, 
            type: q.type, 
            category: q.category, 
            weight: q.weight,
            userAnswer: userAnswer || null, 
            correctAnswer: q.correctAnswer, 
            isCorrect,
            pointsAwarded: isCorrect ? q.weight : 0 
        };
    });

    const level = levels.find(l => score >= l.min && score <= l.max)?.name || 'N/A';
    
    const result = {
        userName: userName.trim(),
        timestamp: new Date().toISOString(),
        score,
        maxScore,
        hardSkillScore,
        maxHardSkillScore,
        softSkillScore,
        maxSoftSkillScore,
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
        showError('Failed to submit test results. Please check your connection.');
    }
}

function showResults(result) {
    const grade = result.percentage >= 80 ? { text: 'Excellent', class: 'grade-excellent' }
        : result.percentage >= 60 ? { text: 'Good', class: 'grade-good' }
        : result.percentage >= 40 ? { text: 'Fair', class: 'grade-fair' }
        : { text: 'Needs Improvement', class: 'grade-poor' };

    const blockResults = result.detailedAnswers.reduce((acc, ans) => {
        const cat = ans.category;
        if (!acc[cat]) acc[cat] = { correct: 0, total: 0, awarded: 0 };
        if (ans.isCorrect || ans.pointsAwarded > 0) acc[cat].correct++;
        acc[cat].awarded += ans.pointsAwarded;
        acc[cat].total++;
        return acc;
    }, {});
    
    // TRANSLATED to English
    const openAnswersHTML = result.detailedAnswers
        .filter(ans => ans.type === 'open' || ans.type === 'code')
        .map(ans => `
            <div class="detailed-answer-item">
                <p><strong>Question (${categoryNames[ans.category] || ans.category} | ${ans.weight} ${ans.weight > 1 ? 'points' : 'point'}):</strong> ${ans.text}</p>
                <p class="user-answer"><strong>Candidate Answer:</strong><pre>${ans.userAnswer || 'No answer'}</pre></p>
            </div>
        `).join('');

    // TRANSLATED to English
    const detailedAnswersHTML = result.detailedAnswers.map(ans => {
        const correctnessClass = (ans.type === 'multiple' && ans.isCorrect) ? 'correct' : (ans.type === 'multiple' && !ans.isCorrect) ? 'incorrect' : '';
        let answerDetails = '';

        if (ans.type === 'multiple') {
            const allOptions = allQuestions.find(q => q.id === ans.questionId)?.options || {};
            const userAnswerText = ans.userAnswer ? `${ans.userAnswer}) ${allOptions[ans.userAnswer]}` : 'No answer';
            const correctAnswerText = `${ans.correctAnswer}) ${allOptions[ans.correctAnswer]}`;
            answerDetails = `
                <p class="user-answer"><strong>Your Answer:</strong> ${userAnswerText}</p>
                ${!ans.isCorrect ? `<p class="correct-answer"><strong>Correct Answer:</strong> ${correctAnswerText}</p>` : ''}
            `;
        } else {
            answerDetails = `<p class="user-answer"><strong>Your Answer:</strong><pre>${ans.userAnswer || 'No answer'}</pre></p>`;
        }

        return `
            <div class="detailed-answer-item ${correctnessClass}">
                <p><strong>Question (${ans.weight} ${ans.weight > 1 ? 'points' : 'point'}):</strong> ${ans.text}</p>
                ${answerDetails}
            </div>
        `;
    }).join('');
    
    const scoreBreakdownHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; text-align: center; margin-bottom: 20px; margin-top: 20px;">
            <div class="result-block">
                <h4>Hard Skills</h4>
                <div class="score-display" style="font-size: 2.5rem; margin-bottom: 0;">${result.hardSkillScore} / ${result.maxHardSkillScore}</div>
            </div>
            <div class="result-block">
                <h4>Soft Skills</h4>
                <div class="score-display" style="font-size: 2.5rem; margin-bottom: 0;">${result.softSkillScore} / ${result.maxSoftSkillScore}</div>
            </div>
        </div>
    `;

    // TRANSLATED to English
    document.getElementById('resultsContent').innerHTML = `
        <div class="results-summary">
            <h3>${result.userName}</h3>
            <div class="score-display">${result.score} / ${result.maxScore}</div>
            <div class="grade-badge ${grade.class}">${result.percentage}% (${grade.text})</div>
        </div>
        ${scoreBreakdownHTML}
        <h4>Results by Category:</h4>
        <div class="detailed-results">
            ${Object.entries(blockResults).map(([cat, res]) => `
                <div class="result-block">
                    <strong>${categoryNames[cat] || cat}:</strong> ${res.awarded} / ${allQuestions.filter(q=>q.category===cat).reduce((s,i)=>s+i.weight,0)} points
                </div>
            `).join('')}
        </div>
        <button id="showDetailsBtn" class="btn" style="margin: 30px auto; display: block;">Show Detailed Review</button>
        <div id="detailedReview" class="hidden">
            <hr style="margin: 30px 0;">
            <h3>Supervisor Review</h3>
            <h4>Open & Practical Questions:</h4>
            <div>
                ${openAnswersHTML.length > 0 ? openAnswersHTML : '<p>There were no open or practical questions in this test.</p>'}
            </div>
            <hr style="margin: 30px 0;">
            <h4>Full Answer Review:</h4>
            <div>${detailedAnswersHTML}</div>
        </div>
    `;

    document.getElementById('showDetailsBtn').addEventListener('click', () => {
        const pass = prompt('Enter supervisor password to view detailed review:');
        if (pass === ADMIN_PASSWORD) {
            document.getElementById('detailedReview').classList.remove('hidden');
            document.getElementById('showDetailsBtn').classList.add('hidden');
        } else if (pass !== null) {
            showError('Incorrect password.');
        }
    });

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

function toggleDetails(id) {
    const el = document.getElementById(`details-${id}`);
    const isHidden = el.style.display === 'none' || el.style.display === '';
    el.style.display = isHidden ? 'block' : 'none';
}

async function gradeOpenQuestion(resultId, questionId, maxPoints) {
    const inputEl = document.getElementById(`grade-${resultId}-${questionId}`);
    const points = parseFloat(inputEl.value);

    if (isNaN(points) || points < 0 || points > maxPoints) {
        // TRANSLATED to English
        showError(`Please enter a valid grade from 0 to ${maxPoints}.`);
        return;
    }

    try {
        await gradeQuestionAPI(resultId, questionId, points);
        showSuccess('Grade saved! Results updating...');
        loadAnalyticsData(); 
    } catch (error) {
        showError(`Failed to save grade: ${error.message}`);
    }
}

function displayAnalytics(data) {
    const recentHTML = data.recentResults.map(r => {
        const openAnswers = r.detailedAnswers.filter(ans => ans.type === 'open' || ans.type === 'code');
        const hardSkillOpenAnswers = openAnswers.filter(ans => hardSkillCategories.includes(ans.category));
        const softSkillOpenAnswers = openAnswers.filter(ans => softSkillCategories.includes(ans.category));

        // TRANSLATED to English
        const createGradingHTML = (answers) => {
            if (answers.length === 0) return '<p>No questions in this category.</p>';
            return answers.map(ans => `
                <div class="detailed-answer-item">
                    <p><strong>Question (${categoryNames[ans.category] || ans.category} | ${ans.weight} ${ans.weight > 1 ? 'points' : 'point'}):</strong> ${ans.text}</p>
                    <p class="user-answer"><strong>Answer:</strong><pre>${ans.userAnswer || 'No answer'}</pre></p>
                    <div class="grading-box">
                        <label for="grade-${r.id}-${ans.questionId}">Grade (out of ${ans.weight}):</label>
                        <input type="number" id="grade-${r.id}-${ans.questionId}" min="0" max="${ans.weight}" step="0.5" value="${ans.pointsAwarded || 0}">
                        <button class="btn btn-secondary" onclick="gradeOpenQuestion('${r.id}', '${ans.questionId}', ${ans.weight})">Save</button>
                    </div>
                </div>
            `).join('');
        };

        const supervisorViewHTML = `
            <h4>Hard Skills Grading (Open & Practical)</h4>
            ${createGradingHTML(hardSkillOpenAnswers)}
            <hr style="margin: 20px 0;">
            <h4>Soft Skills Grading (Open)</h4>
            ${createGradingHTML(softSkillOpenAnswers)}
        `;
        
        // TRANSLATED to English
        const detailedAnswersHTML = r.detailedAnswers.map(ans => {
            const correctnessClass = ans.isCorrect ? 'correct' : 'incorrect';
            let answerDetails = '';
            if (ans.type === 'multiple') {
                const allOptions = allQuestions.find(q => q.id === ans.questionId)?.options || {};
                const userAnswerText = ans.userAnswer ? `${ans.userAnswer}) ${allOptions[ans.userAnswer] || ''}` : 'No answer';
                const correctAnswerText = ans.correctAnswer ? `${ans.correctAnswer}) ${allOptions[ans.correctAnswer] || ''}` : '';
                answerDetails = `
                    <p class="user-answer"><strong>Selected:</strong> ${userAnswerText}</p>
                    ${!ans.isCorrect && ans.correctAnswer ? `<p class="correct-answer"><strong>Correct:</strong> ${correctAnswerText}</p>` : ''}
                `;
            } else {
                answerDetails = `<p class="user-answer"><strong>Answer:</strong><pre>${ans.userAnswer || 'No answer'}</pre></p>`;
            }
            return `
                <div class="detailed-answer-item ${correctnessClass}">
                    <p><strong>Question (${ans.weight} ${ans.weight > 1 ? 'points' : 'point'}):</strong> ${ans.text}</p>
                    ${answerDetails}
                </div>
            `;
        }).join('');

        return `
            <div class="result-block">
                <strong>${r.userName}</strong>: ${r.score}/${r.maxScore} (${r.percentage}%)
                <div style="font-size: 0.9rem; color: #333; margin-top: 5px;">
                    Hard: <strong>${r.hardSkillScore || 0}/${r.maxHardSkillScore || 0}</strong> | Soft: <strong>${r.softSkillScore || 0}/${r.maxSoftSkillScore || 0}</strong>
                </div>
                <div style="font-size: 0.8rem; color: #666; margin-bottom: 10px;">${new Date(r.timestamp).toLocaleString()}</div>
                <button class="btn btn-secondary" onclick="toggleDetails('supervisor-${r.id}')" style="margin-right: 10px; margin-bottom: 5px;">For Supervisor</button>
                <button class="btn" onclick="toggleDetails('${r.id}')" style="margin-bottom: 5px;">All Details</button>
                <div id="details-supervisor-${r.id}" style="display:none; margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;">
                    ${supervisorViewHTML}
                </div>
                <div id="details-${r.id}" style="display:none; margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;">
                    <h4>All Answers</h4>
                    ${detailedAnswersHTML}
                </div>
            </div>
        `;
    }).join('') || '<p>No recent results.</p>';

    // TRANSLATED to English
    document.getElementById('analyticsContent').innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div class="result-block"><h4>Total Tests</h4><div class="score-display">${data.totalTests}</div></div>
            <div class="result-block"><h4>Avg Score</h4><div class="score-display">${data.averageScore}%</div></div>
            <div class="result-block"><h4>Avg Hard Skills</h4><div class="score-display">${data.averageHardSkillScore}%</div></div>
            <div class="result-block"><h4>Avg Soft Skills</h4><div class="score-display">${data.averageSoftSkillScore}%</div></div>
        </div>
        <h3>Recent Results</h3>
        <div class="detailed-results">
            ${recentHTML}
        </div>
    `;
}

// =================================================================================
// Initialization
// =================================================================================

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('questionType').addEventListener('change', toggleQuestionTypeFields);
    initializeApp();
    // CHANGED: Default to 'en' (English)
    const savedLanguage = localStorage.getItem('language') || 'en'; 
    setLanguage(savedLanguage);
});

async function initializeApp() {
    setMode('candidate');
    showSection('welcome');
    try {
        const data = await loadQuestions();
        allQuestions = data.questions || [];
        updateWelcomeStats();
        
        // TRANSLATED to English
        const categoryFilter = document.getElementById('categoryFilter');
        categoryFilter.innerHTML = `<option value="all">All Categories</option>` + 
            Object.entries(categoryNames).map(([val, name]) => `<option value="${val}">${name}</option>`).join('');
    } catch (error) {
        showError("Failed to initialize app by loading questions.");
    }
}

// Configuration
const API_BASE_URL = '/api'; // Adjust this for your Cloudflare Worker endpoint

// --- NEW: Internationalization (i18n) ---
const translations = {
    en: {
        mainTitle: '🧠 ML Engineer Testing Platform',
        mainSubtitle: 'Comprehensive evaluation system for Machine Learning professionals',
        candidateMode: 'Candidate Mode',
        adminMode: 'Administrator Mode',
        navStartTest: 'Start Test',
        navResults: 'Results',
        navEditQuestions: 'Edit Questions',
        navAnalytics: 'Analytics',
        welcomeTitle: 'Machine Learning Engineer Assessment',
        welcomeSubtitle: 'Comprehensive evaluation covering all essential ML engineering skills',
        overviewTitle: 'Test Overview',
        overviewQuestions: 'Questions',
        overviewMinutes: 'Minutes',
        overviewPoints: 'Total Points',
        coverageTitle: 'Coverage Areas:',
        loadingCoverage: 'Loading test information...',
        instructionsTitle: 'Instructions:',
        instruction1: 'You have 60 minutes to complete all questions',
        instruction2: 'Each question has one correct answer',
        instruction3: 'You can navigate between questions and change answers',
        instruction4: 'Questions are weighted by difficulty (1, 3, or 5 points)',
        instruction5: 'Your progress will be automatically saved',
        beginAssessment: 'Begin Assessment',
        allowRetake: 'Allow Retake for This User',
        qEditorTitle: 'Question Management',
        qEditorAddTitle: 'Add New Question',
        qEditorCategory: 'Category:',
        qEditorWeight: 'Weight (Points):',
        qEditorEasy: '1 point (Easy)',
        qEditorMedium: '3 points (Medium)',
        qEditorHard: '5 points (Hard)',
        qEditorText: 'Question Text:',
        qEditorOptA: 'Option A:',
        qEditorOptB: 'Option B:',
        qEditorOptC: 'Option C:',
        qEditorOptD: 'Option D:',
        qEditorCorrect: 'Correct Answer:',
        qEditorAddBtn: 'Add Question',
        qEditorClearBtn: 'Clear Form',
        qBankTitle: 'Question Bank',
        qBankFilter: 'Filter by Category:',
        qBankAllCat: 'All Categories',
        loadingQuestions: 'Loading questions...',
        qBankExport: 'Export Questions',
        qBankImport: 'Import Questions',
        qBankReset: 'Reset to Default',
        testTitle: 'Machine Learning Engineer Assessment',
        testSubtitle: 'Answer all questions within the time limit',
        testStartFromWelcome: 'Please start the test from the welcome section.',
        submitTestBtn: 'Submit Test',
        resultsTitle: 'Test Results',
        resultsCompleteTest: 'Complete a test to see your results here.',
        analyticsTitle: 'Performance Analytics',
        loadingAnalytics: 'Loading analytics data...',
        editBtn: 'Edit',
        deleteBtn: 'Delete',
        prevBtn: '← Previous',
        nextBtn: 'Next →',
        reviewSubmitBtn: 'Review & Submit',
        // Dynamic text
        noQuestionsAvailable: 'No questions available. Add questions using the form.',
        noQuestionsInCategory: 'No questions found for this category.',
        qCategory: 'Category',
        qAnswer: 'Answer',
        performanceByArea: 'Performance by Area',
        resCorrect: 'Correct',
        resPoints: 'Points',
        resBlockScore: 'Block Score',
        resScore: 'Score',
        resAssessmentFor: 'ML Engineer Assessment for',
        resTimeUsed: 'Time Used',
        resCompleted: 'Completed',
        backToWelcome: 'Back to Welcome',
        viewAnalytics: 'View Analytics',
        testCompletedThankYou: 'You have completed the test. Thank you!',
        analyticsTotalTests: 'Total Tests Taken',
        analyticsAvgScore: 'Average Score',
        analyticsTotalQuestions: 'Total Questions',
        analyticsPassRate: 'Pass Rate',
        analyticsRecentResults: 'Recent Test Results'
    },
    ru: {
        mainTitle: '🧠 Платформа для тестирования ML-инженеров',
        mainSubtitle: 'Комплексная система оценки для специалистов по машинному обучению',
        candidateMode: 'Режим кандидата',
        adminMode: 'Режим администратора',
        navStartTest: 'Начать тест',
        navResults: 'Результаты',
        navEditQuestions: 'Редактор вопросов',
        navAnalytics: 'Аналитика',
        welcomeTitle: 'Оценка инженера по машинному обучению',
        welcomeSubtitle: 'Комплексная оценка, охватывающая все основные навыки ML-инженера',
        overviewTitle: 'Обзор теста',
        overviewQuestions: 'Вопросы',
        overviewMinutes: 'Минуты',
        overviewPoints: 'Всего баллов',
        coverageTitle: 'Охватываемые области:',
        loadingCoverage: 'Загрузка информации о тесте...',
        instructionsTitle: 'Инструкции:',
        instruction1: 'У вас есть 60 минут, чтобы ответить на все вопросы',
        instruction2: 'У каждого вопроса только один правильный ответ',
        instruction3: 'Вы можете перемещаться между вопросами и изменять ответы',
        instruction4: 'Вопросы оцениваются по сложности (1, 3 или 5 баллов)',
        instruction5: 'Ваш прогресс будет сохранен автоматически',
        beginAssessment: 'Начать оценку',
        allowRetake: 'Разрешить пересдачу для этого пользователя',
        qEditorTitle: 'Управление вопросами',
        qEditorAddTitle: 'Добавить новый вопрос',
        qEditorCategory: 'Категория:',
        qEditorWeight: 'Вес (Баллы):',
        qEditorEasy: '1 балл (Легкий)',
        qEditorMedium: '3 балла (Средний)',
        qEditorHard: '5 баллов (Сложный)',
        qEditorText: 'Текст вопроса:',
        qEditorOptA: 'Вариант A:',
        qEditorOptB: 'Вариант B:',
        qEditorOptC: 'Вариант C:',
        qEditorOptD: 'Вариант D:',
        qEditorCorrect: 'Правильный ответ:',
        qEditorAddBtn: 'Добавить вопрос',
        qEditorClearBtn: 'Очистить форму',
        qBankTitle: 'Банк вопросов',
        qBankFilter: 'Фильтр по категории:',
        qBankAllCat: 'Все категории',
        loadingQuestions: 'Загрузка вопросов...',
        qBankExport: 'Экспорт вопросов',
        qBankImport: 'Импорт вопросов',
        qBankReset: 'Сбросить по умолчанию',
        testTitle: 'Оценка инженера по машинному обучению',
        testSubtitle: 'Ответьте на все вопросы за отведенное время',
        testStartFromWelcome: 'Пожалуйста, начните тест с главного экрана.',
        submitTestBtn: 'Завершить тест',
        resultsTitle: 'Результаты теста',
        resultsCompleteTest: 'Завершите тест, чтобы увидеть здесь свои результаты.',
        analyticsTitle: 'Аналитика производительности',
        loadingAnalytics: 'Загрузка данных аналитики...',
        editBtn: 'Ред.',
        deleteBtn: 'Удал.',
        prevBtn: '← Назад',
        nextBtn: 'Далее →',
        reviewSubmitBtn: 'Проверить и завершить',
        // Dynamic text
        noQuestionsAvailable: 'Вопросы отсутствуют. Добавьте вопросы в режиме администратора.',
        noQuestionsInCategory: 'Вопросов в этой категории не найдено.',
        qCategory: 'Категория',
        qAnswer: 'Ответ',
        performanceByArea: 'Результаты по областям',
        resCorrect: 'Правильно',
        resPoints: 'Баллы',
        resBlockScore: 'Оценка по блоку',
        resScore: 'Результат',
        resAssessmentFor: 'Оценка ML-инженера для',
        resTimeUsed: 'Затраченное время',
        resCompleted: 'Завершено',
        backToWelcome: 'Вернуться на главный экран',
        viewAnalytics: 'Посмотреть аналитику',
        testCompletedThankYou: 'Вы завершили тест. Спасибо!',
        analyticsTotalTests: 'Всего тестов пройдено',
        analyticsAvgScore: 'Средний балл',
        analyticsTotalQuestions: 'Всего вопросов',
        analyticsPassRate: 'Процент сдачи',
        analyticsRecentResults: 'Последние результаты'
    }
};
let currentLang = 'en';

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
// --- NEW ---
const categoryNamesRU = {
    probability_stats: 'Вероятность и статистика',
    ml_algorithms: 'Алгоритмы ML',
    data_preparation: 'Подготовка данных',
    validation_metrics: 'Валидация и метрики'
};


// --- NEW: i18n Functions ---
function translateUI() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLang', lang);
    document.querySelectorAll('.lang-switcher button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');
    
    // Update dynamic category names in filters etc.
    const categoryFilter = document.getElementById('categoryFilter');
    if(categoryFilter){
        categoryFilter.querySelectorAll('option').forEach(opt => {
            const names = currentLang === 'ru' ? categoryNamesRU : categoryNames;
            if(names[opt.value]){
                opt.textContent = names[opt.value];
            }
        });
        // re-translate "All Categories"
        categoryFilter.querySelector('option[value="all"]').textContent = translations[currentLang].qBankAllCat;
    }

    translateUI();
    
    // Refresh currently visible dynamic content
    if(document.getElementById('welcome').classList.contains('active')){
       updateWelcomeStats();
    }
    if(document.getElementById('questionEditor').classList.contains('active')){
       updateQuestionsList();
    }
}


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
        coverageAreasEl.innerHTML = `<li style="color: #dc3545;">${translations[currentLang].noQuestionsAvailable}</li>`;
        return;
    }

    const totalQuestions = allQuestions.length;
    const totalPoints = allQuestions.reduce((sum, q) => sum + q.weight, 0);

    const categoryCounts = {};
    allQuestions.forEach(q => {
        categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
    });

    totalQuestionsEl.textContent = totalQuestions;
    totalPointsEl.textContent = totalPoints;
    
    const names = currentLang === 'ru' ? categoryNamesRU : categoryNames;
    const coverageHTML = Object.entries(categoryCounts).map(([category, count]) => 
        `<li><strong>${names[category] || category}:</strong> ${count} ${translations[currentLang].overviewQuestions.toLowerCase()}</li>`
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
    document.querySelector(`[onclick="setMode('${mode}')"]`).classList.add('active');

    const candidateNav = document.getElementById('candidateNavigation');
    const adminNav = document.getElementById('adminNavigation');
    const allowRetakeBtn = document.getElementById('allowRetakeBtn');

    if (mode === 'candidate') {
        candidateNav.classList.remove('hidden');
        adminNav.classList.add('hidden');
        allowRetakeBtn.classList.add('hidden');
    } else {
        candidateNav.classList.add('hidden');
        adminNav.classList.remove('hidden');
        allowRetakeBtn.classList.remove('hidden');
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
    
    const navButtons = document.querySelectorAll(`#${activeNav} .nav-btn`);
    navButtons.forEach(btn => {
        const btnText = btn.getAttribute('data-i18n');
        if ((sectionId === 'welcome' && btnText.includes('navStartTest')) ||
            (sectionId === 'questionEditor' && btnText.includes('navEditQuestions')) ||
            (sectionId === 'results' && btnText.includes('navResults')) ||
            (sectionId === 'analytics' && btnText.includes('navAnalytics'))) {
            btn.classList.add('active');
        }
    });
    
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
        questionsList.innerHTML = `<div class="loading">${translations[currentLang].noQuestionsAvailable}</div>`;
        return;
    }
    
    const filteredQuestions = filterCategory === 'all' 
        ? allQuestions 
        : allQuestions.filter(q => q.category === filterCategory);
    
    if (filteredQuestions.length === 0) {
        questionsList.innerHTML = `<div class="loading">${translations[currentLang].noQuestionsInCategory}</div>`;
        return;
    }
    
    const names = currentLang === 'ru' ? categoryNamesRU : categoryNames;
    questionsList.innerHTML = filteredQuestions.map(q => `
        <div class="question-item">
            <div class="question-header">
                <span class="question-points">${q.weight} pts</span>
                <div class="question-actions">
                    <button onclick="editQuestion('${q.id}')" data-i18n="editBtn">${translations[currentLang].editBtn}</button>
                    <button onclick="deleteQuestion('${q.id}')" data-i18n="deleteBtn">${translations[currentLang].deleteBtn}</button>
                </div>
            </div>
            <div style="margin-bottom: 8px;"><strong>${translations[currentLang].qCategory}:</strong> ${names[q.category] || q.category}</div>
            <div style="margin-bottom: 8px;"><strong>Q:</strong> ${q.text}</div>
            <div style="font-size: 14px; color: #666;"><strong>${translations[currentLang].qAnswer}:</strong> ${q.correctAnswer}) ${q.options[q.correctAnswer]}</div>
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

// --- NEW: Admin function to allow a user to retake the test ---
function allowRetake() {
    if (currentMode !== 'admin') {
        showError('This function is for administrators only.');
        return;
    }
    
    if (confirm('Are you sure you want to allow this user to take the test again? This will clear their "test taken" status.')) {
        localStorage.removeItem('testTaken');
        showSuccess('User can now start a new test attempt.');
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
    
    document.getElementById('testTitle').textContent = translations[currentLang].testTitle;
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
    
    const questionOf = `Question ${index + 1} of ${currentTest.length}`;
    const questionOfRU = `Вопрос ${index + 1} из ${currentTest.length}`;

    testContainer.innerHTML = `
        <div class="question-card">
            <div class="question-number">${index + 1}</div>
            <h3>${currentLang === 'ru' ? questionOfRU : questionOf}</h3>
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
                <button class="btn" onclick="previousQuestion()" ${index === 0 ? 'disabled' : ''}>${translations[currentLang].prevBtn}</button>
                <button class="btn" onclick="nextQuestion()">
                    ${index === currentTest.length - 1 ? translations[currentLang].reviewSubmitBtn : translations[currentLang].nextBtn}
                </button>
            </div>
        </div>
    `;
    
    updateProgress();
}

function selectAnswer(questionId, answer) {
    userAnswers[questionId] = answer;
    
    const labels = document.querySelectorAll('.answer-option');
    labels.forEach(label => {
        label.classList.remove('selected');
        const input = label.querySelector(`input[name="q${questionId}"]`);
        if (input && input.value === answer) {
            label.classList.add('selected');
            input.checked = true;
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
    
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
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
        detailedAnswers: detailedAnswers,
        questions: currentTest.length,
        blockResults,
        userName: userName.trim()
    };
    
    await submitTestResults(result);
    localStorage.setItem('testTaken', 'true');
    testResults.push(result);
    showResults(result);
    showSection('results');
}

function showResults(result) {
    const names = currentLang === 'ru' ? categoryNamesRU : categoryNames;
    let detailedResults = Object.entries(result.blockResults).map(([block, blockResult]) => `
        <div class="result-block">
            <h4>${names[block] || block}</h4>
            <p><strong>${translations[currentLang].resCorrect}:</strong> ${blockResult.correct}/${blockResult.total} questions</p>
            <p><strong>${translations[currentLang].resPoints}:</strong> ${blockResult.earnedPoints}/${blockResult.maxPoints}</p>
            <p><strong>${translations[currentLang].resBlockScore}:</strong> ${Math.round((blockResult.earnedPoints / blockResult.maxPoints) * 100)}%</p>
        </div>
    `).join('');
                        
    document.getElementById('resultsContent').innerHTML = `
        <div class="results-summary">
            <div class="score-display">${result.score}/${result.maxScore}</div>
            <div style="font-size: 1.5rem; color: #666; margin-bottom: 10px;">${result.percentage}% ${translations[currentLang].resScore}</div>
            <div class="grade-badge ${result.gradeClass}">${result.grade}</div>
            <p style="margin-top: 20px; color: #666;">
                <strong>${translations[currentLang].resAssessmentFor} ${result.userName}</strong> <br>
                <strong>${translations[currentLang].resTimeUsed}:</strong> ${result.timeUsed} <br>
                <strong>${translations[currentLang].resCompleted}:</strong> ${new Date(result.timestamp).toLocaleString()}
            </p>
        </div>
        
        <div class="detailed-results">
            <h3 data-i18n="performanceByArea">${translations[currentLang].performanceByArea}</h3>
            ${detailedResults}
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            ${currentMode === 'admin' ? `<button class="btn" onclick="showSection('welcome')">${translations[currentLang].backToWelcome}</button>` : `<p>${translations[currentLang].testCompletedThankYou}</p>`}
            ${currentMode === 'admin' ? `<button class="btn" onclick="showSection('analytics')" style="margin-left: 10px;">${translations[currentLang].viewAnalytics}</button>` : ''}
        </div>
    `;
}

// Analytics Functions
async function loadAnalyticsData() {
    const analyticsContent = document.getElementById('analyticsContent');
    analyticsContent.innerHTML = `<div class="loading" data-i18n="loadingAnalytics">${translations[currentLang].loadingAnalytics}</div>`;
    
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
                <h4 data-i18n="analyticsTotalTests">${translations[currentLang].analyticsTotalTests}</h4>
                <div style="font-size: 2rem; font-weight: 700; color: #667eea;">${data.totalTests || 0}</div>
            </div>
            <div class="result-block">
                <h4 data-i18n="analyticsAvgScore">${translations[currentLang].analyticsAvgScore}</h4>
                <div style="font-size: 2rem; font-weight: 700; color: #667eea;">${data.averageScore || 0}%</div>
            </div>
            <div class="result-block">
                <h4 data-i18n="analyticsTotalQuestions">${translations[currentLang].analyticsTotalQuestions}</h4>
                <div style="font-size: 2rem; font-weight: 700; color: #667eea;">${data.totalQuestions || 0}</div>
            </div>
            <div class="result-block">
                <h4 data-i18n="analyticsPassRate">${translations[currentLang].analyticsPassRate}</h4>
                <div style="font-size: 2rem; font-weight: 700; color: #667eea;">${data.passRate || 0}%</div>
            </div>
        </div>
        
        <div class="detailed-results">
            <h3 data-i18n="analyticsRecentResults">${translations[currentLang].analyticsRecentResults}</h3>
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
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    setLanguage(savedLang);

    setMode('candidate');
    showSection('welcome');
    await loadQuestions();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeApp);


// Cloudflare Worker for ML Testing Platform Backend

// Default questions dataset
const DEFAULT_QUESTIONS = [
  // --- Russian Questions ---
  {
    id: 1, category: 'probability_stats', weight: 1,
    text: 'Что такое p-value?',
    options: {
      A: 'Вероятность того, что нулевая гипотеза верна.',
      B: 'Вероятность получить наблюдаемые (или более экстремальные) результаты, при условии, что нулевая гипотеза верна.',
      C: 'Мощность статистического теста.',
      D: 'Размер выборки, необходимый для теста.'
    },
    correctAnswer: 'B'
  },
  {
    id: 2, category: 'probability_stats', weight: 3,
    text: 'В контексте банковского фрод-мониторинга, что является ошибкой II рода (Type II Error)?',
    options: {
      A: 'Система помечает легитимную операцию как мошенническую.',
      B: 'Система пропускает мошенническую операцию, считая ее легитимной.',
      C: 'Клиент совершает ошибку при вводе данных.',
      D: 'Модель не может обработать транзакцию из-за технического сбоя.'
    },
    correctAnswer: 'B'
  },
  {
    id: 11, category: 'ml_algorithms', weight: 1,
    text: 'Какой алгоритм из перечисленных является методом кластеризации?',
    options: {
      A: 'Логистическая регрессия.',
      B: 'Дерево решений.',
      C: 'K-Means.',
      D: 'Метод главных компонент (PCA).'
    },
    correctAnswer: 'C'
  },
  // ... other Russian questions from your file ...
  {
    id: 33, category: 'validation_metrics', weight: 1,
    text: 'Что показывает метрика ROC-AUC?',
    options: {
      A: 'Долю правильных ответов модели.',
      B: 'Способность модели ранжировать объекты, ставя положительные примеры выше отрицательных.',
      C: 'Среднюю ошибку предсказания для регрессионных моделей.',
      D: 'Количество кластеров в данных.'
    },
    correctAnswer: 'B'
  },

  // --- NEW: Added English Questions ---
  {
    id: "eng-prob-1", category: 'probability_stats', weight: 5,
    text: 'What is the Central Limit Theorem and why is it important in machine learning?',
    options: {
      A: 'It states that all data naturally follows a normal distribution.',
      B: 'It guarantees that the mean of a large enough sample from a population will be the same as the population mean.',
      C: 'It states that the distribution of sample means of a large number of samples taken from a population will be approximately normally distributed, regardless of the population\'s actual distribution.',
      D: 'It is a theorem used exclusively for calculating p-values in A/B tests.'
    },
    correctAnswer: 'C'
  },
  {
    id: "eng-algo-1", category: 'ml_algorithms', weight: 3,
    text: 'What is the main difference between a Random Forest and a Gradient Boosting Machine (GBM)?',
    options: {
      A: 'Random Forest is for regression, while GBM is for classification.',
      B: 'Random Forest builds trees in parallel and averages them, while GBM builds them sequentially, with each tree correcting its predecessor\'s errors.',
      C: 'GBM is less prone to overfitting than Random Forest.',
      D: 'Random Forest uses "strong learners" while GBM uses "weak learners".'
    },
    correctAnswer: 'B'
  },
  {
    id: "eng-algo-2", category: 'ml_algorithms', weight: 5,
    text: 'In the context of Support Vector Machines (SVM), what is the "kernel trick"?',
    options: {
      A: 'A method to speed up the training of the SVM by using less data.',
      B: 'A technique to handle missing values before feeding them to the SVM.',
      C: 'It allows SVMs to operate in a high-dimensional feature space without explicitly computing the coordinates of the data in that space, enabling them to find non-linear decision boundaries.',
      D: 'It is the process of selecting the correct regularization parameter "C".'
    },
    correctAnswer: 'C'
  },
  {
    id: "eng-data-1", category: 'data_preparation', weight: 3,
    text: 'When should you use standardization (Z-score normalization) versus min-max scaling for feature scaling?',
    options: {
      A: 'Min-max scaling is always better because it preserves the original distribution.',
      B: 'Standardization is useful for algorithms that assume a normal distribution (like Linear Regression, SVM), while min-max is good for algorithms that do not make assumptions about the distribution (like K-NN) or for image processing.',
      C: 'You should always use standardization because it is more robust to outliers.',
      D: 'It does not matter which one you use; they produce the same result.'
    },
    correctAnswer: 'B'
  },
  {
    id: "eng-metrics-1", category: 'validation_metrics', weight: 3,
    text: 'What is the difference between Precision and Recall?',
    options: {
      A: 'Precision measures how many selected items are relevant, while Recall measures how many relevant items are selected.',
      B: 'Recall measures how many selected items are relevant, while Precision measures how many relevant items are selected.',
      C: 'They are the same metric, just with different names.',
      D: 'Precision is used for classification, and Recall is used for regression.'
    },
    correctAnswer: 'A'
  }
];

// --- FIXED: Use crypto.randomUUID for truly unique IDs ---
function generateId() {
  return crypto.randomUUID();
}

function validateQuestion(question) {
  const required = ['category', 'weight', 'text', 'options', 'correctAnswer'];
  for (const field of required) {
    if (!question[field]) return `Missing required field: ${field}`;
  }
  if (!['probability_stats', 'ml_algorithms', 'data_preparation', 'validation_metrics'].includes(question.category)) {
    return 'Invalid category';
  }
  if (![1, 3, 5].includes(question.weight)) return 'Weight must be 1, 3, or 5';
  if (!question.options.A || !question.options.B || !question.options.C || !question.options.D) {
    return 'All options (A, B, C, D) are required';
  }
  if (!['A', 'B', 'C', 'D'].includes(question.correctAnswer)) {
    return 'Correct answer must be A, B, C, or D';
  }
  return null;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// --- NEW: Main handler for Cloudflare Pages Functions ---
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // API Routing
    if (path === '/api/questions' && request.method === 'GET') {
      return await getQuestions(env);
    }
    if (path === '/api/questions' && request.method === 'POST') {
      return await createQuestion(request, env);
    }
    if (path.startsWith('/api/questions/') && request.method === 'PUT') {
      const id = path.split('/').pop();
      return await updateQuestion(request, id, env);
    }
    if (path.startsWith('/api/questions/') && request.method === 'DELETE') {
      const id = path.split('/').pop();
      return await deleteQuestion(id, env);
    }
    if (path === '/api/questions/reset' && request.method === 'POST') {
      return await resetQuestions(env);
    }
    if (path === '/api/results' && request.method === 'POST') {
      return await saveTestResult(request, env);
    }
    if (path === '/api/analytics' && request.method === 'GET') {
      return await getAnalytics(env);
    }

    return new Response(JSON.stringify({ success: false, error: 'Route not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Request handling error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// --- REMOVED: Old 'addEventListener' and 'handleRequest' are no longer needed ---

// --- CHANGED: All functions below now accept `env` for KV access ---

async function getQuestions(env) {
  try {
    let questions = await env.ML_QUESTIONS.get('questions', { type: 'json' });
    if (!questions) {
      questions = DEFAULT_QUESTIONS;
      await env.ML_QUESTIONS.put('questions', JSON.stringify(questions));
    }
    return new Response(JSON.stringify({ success: true, questions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error getting questions:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to get questions' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function createQuestion(request, env) {
  try {
    const question = await request.json();
    const validationError = validateQuestion(question);
    if (validationError) {
      return new Response(JSON.stringify({ success: false, error: validationError }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    let questions = await env.ML_QUESTIONS.get('questions', { type: 'json' }) || [];
    
    // --- FIXED: Assign new string UUID, do not parseInt ---
    question.id = generateId();
    questions.push(question);
    
    await env.ML_QUESTIONS.put('questions', JSON.stringify(questions));
    return new Response(JSON.stringify({ success: true, question }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating question:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to create question' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function updateQuestion(request, id, env) {
  try {
    const questionData = await request.json();
    const validationError = validateQuestion(questionData);
    if (validationError) {
      return new Response(JSON.stringify({ success: false, error: validationError }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    let questions = await env.ML_QUESTIONS.get('questions', { type: 'json' }) || [];
    const index = questions.findIndex(q => q.id == id); // Loose equality is okay here for mixed old/new IDs
    if (index === -1) {
      return new Response(JSON.stringify({ success: false, error: 'Question not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // --- FIXED: Use the string ID from the URL, do not parseInt ---
    questions[index] = { ...questionData, id: id };
    
    await env.ML_QUESTIONS.put('questions', JSON.stringify(questions));
    return new Response(JSON.stringify({ success: true, question: questions[index] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating question:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to update question' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function deleteQuestion(id, env) {
  try {
    let questions = await env.ML_QUESTIONS.get('questions', { type: 'json' }) || [];
    const initialLength = questions.length;
    questions = questions.filter(q => q.id != id); // Loose equality
    if (questions.length === initialLength) {
      return new Response(JSON.stringify({ success: false, error: 'Question not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    await env.ML_QUESTIONS.put('questions', JSON.stringify(questions));
    return new Response(JSON.stringify({ success: true, message: 'Question deleted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to delete question' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function resetQuestions(env) {
  try {
    await env.ML_QUESTIONS.put('questions', JSON.stringify(DEFAULT_QUESTIONS));
    return new Response(JSON.stringify({ success: true, message: 'Questions reset to default', questions: DEFAULT_QUESTIONS }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error resetting questions:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to reset questions' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function saveTestResult(request, env) {
  try {
    const result = await request.json();
    result.serverTimestamp = new Date().toISOString();
    // --- FIXED: Assign new string UUID ---
    result.id = generateId();
    
    let results = await env.ML_QUESTIONS.get('results', { type: 'json' }) || [];
    results.push(result);
    if (results.length > 100) {
      results = results.slice(-100);
    }
    await env.ML_QUESTIONS.put('results', JSON.stringify(results));
    return new Response(JSON.stringify({ success: true, message: 'Result saved successfully', id: result.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving result:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to save result' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function getAnalytics(env) {
  try {
    const results = await env.ML_QUESTIONS.get('results', { type: 'json' }) || [];
    const questions = await env.ML_QUESTIONS.get('questions', { type: 'json' }) || DEFAULT_QUESTIONS;
    if (results.length === 0) {
      return new Response(JSON.stringify({ success: true, totalTests: 0, averageScore: 0, totalQuestions: questions.length, passRate: 0, recentResults: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const totalTests = results.length;
    const averageScore = Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length);
    const passRate = Math.round((results.filter(r => r.percentage >= 60).length / results.length) * 100);
    const recentResults = results.sort((a, b) => new Date(b.serverTimestamp || b.timestamp) - new Date(a.serverTimestamp || a.timestamp)).slice(0, 10);
    return new Response(JSON.stringify({ success: true, totalTests, averageScore, totalQuestions: questions.length, passRate, recentResults }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to get analytics' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
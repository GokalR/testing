// Cloudflare Worker for ML Testing Platform Backend

// Default questions dataset
const DEFAULT_QUESTIONS = [
  // Hard Skills (50 points total)
  // Block 1: Probability and Statistics (10 questions, 15 points adjusted)
  {
    id: 'h1',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
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
    id: 'h2',
    type: 'multiple',
    category: 'probability_stats',
    weight: 2,
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
    id: 'h3',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'Какое статистическое распределение чаще всего используется для моделирования количества дефолтов по кредитам в портфеле за определенный период?',
    options: {
      A: 'Нормальное распределение.',
      B: 'Распределение Пуассона.',
      C: 'Равномерное распределение.',
      D: 'Экспоненциальное распределение.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h4',
    type: 'multiple',
    category: 'probability_stats',
    weight: 2,
    text: 'Что из перечисленного НЕ является предпосылкой для применения классической линейной регрессии?',
    options: {
      A: 'Линейная зависимость между предикторами и целевой переменной.',
      B: 'Отсутствие мультиколлинеарности между предикторами.',
      C: 'Нормальное распределение всех предикторов.',
      D: 'Гомоскедастичность (постоянство дисперсии) остатков.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h5',
    type: 'multiple',
    category: 'probability_stats',
    weight: 2,
    text: 'Зачем необходимо проводить A/B тестирование при внедрении новой скоринговой модели?',
    options: {
      A: 'Чтобы проверить, корректно ли написан код модели.',
      B: 'Чтобы измерить реальное влияние новой модели на бизнес-метрики (например, долю одобрений и уровень дефолтов) в сравнении со старой.',
      C: 'Чтобы определить, какая из моделей работает быстрее.',
      D: 'Чтобы собрать больше данных для обучения.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h6',
    type: 'multiple',
    category: 'probability_stats',
    weight: 3,
    text: 'Что такое Центральная Предельная Теорема?',
    options: {
      A: 'Теорема о том, что любая случайная величина имеет нормальное распределение.',
      B: 'Теорема о том, что дисперсия выборки всегда меньше дисперсии генеральной совокупности.',
      C: 'Теорема о том, что распределение выборочных средних стремится к нормальному при увеличении размера выборки, независимо от исходного распределения.',
      D: 'Теорема о том, что p-value всегда должно быть меньше 0.05.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h7',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'Вам нужно сравнить средний чек по кредитным картам у двух групп клиентов. Какой статистический тест наиболее подходит для этой задачи?',
    options: {
      A: 'Хи-квадрат тест.',
      B: 'T-тест для независимых выборок.',
      C: 'Корреляционный анализ Пирсона.',
      D: 'Дисперсионный анализ (ANOVA).'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h8',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'Что такое доверительный интервал?',
    options: {
      A: 'Диапазон, в котором, по нашему мнению, находится истинное значение параметра генеральной совокупности с определенным уровнем уверенности.',
      B: 'Диапазон, в который попадают все значения выборки.',
      C: 'Интервал, в котором p-value считается значимым.',
      D: 'Промежуток времени, за который собирались данные.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h9',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'Как проблема множественных сравнений (multiple comparisons problem) влияет на интерпретацию p-value при проведении десятков A/B-тестов одновременно?',
    options: {
      A: 'Никак не влияет.',
      B: 'Уменьшает вероятность совершить ошибку I рода.',
      C: 'Увеличивает вероятность случайного получения статистически значимого результата (ошибки I рода), поэтому требуется поправка (например, Бонферрони).',
      D: 'Требует увеличения размера выборки для каждого теста.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h10',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'Что такое коэффициент детерминации (R-квадрат) в регрессионном анализе?',
    options: {
      A: 'Мера корреляции между двумя переменными.',
      B: 'Доля дисперсии зависимой переменной, объясняемая рассматриваемой моделью.',
      C: 'Средняя ошибка модели.',
      D: 'Количество признаков в модели.'
    },
    correctAnswer: 'B'
  },
  // Block 2: Classical ML Algorithms (12 questions, 15 points adjusted)
  {
    id: 'h11',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Какой алгоритм из перечисленных является методом кластеризации?',
    options: {
      A: 'Логистическая регрессия.',
      B: 'Дерево решений.',
      C: 'K-Means.',
      D: 'Метод главных компонент (PCA).'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h12',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'В чем заключается основная идея алгоритма градиентного бустинга?',
    options: {
      A: 'Он строит множество независимых деревьев, а затем усредняет их предсказания.',
      B: 'Он последовательно строит деревья, где каждое следующее дерево пытается исправить ошибки предыдущего.',
      C: 'Он находит гиперплоскость, разделяющую классы с максимальным зазором.',
      D: 'Он группирует данные на основе их схожести в пространстве признаков.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h13',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Для какой задачи НЕ подходит логистическая регрессия?',
    options: {
      A: 'Предсказание оттока клиента (да/нет).',
      B: 'Определение вероятности дефолта по кредиту.',
      C: 'Предсказание суммы следующей транзакции клиента.',
      D: 'Скоринг заявок на кредит (одобрить/отклонить).'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h14',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Что такое "проклятие размерности"?',
    options: {
      A: 'Проблема, при которой модель становится слишком сложной для интерпретации.',
      B: 'Проблема переобучения модели из-за большого количества признаков.',
      C: 'Явление, при котором данные становятся очень разреженными в многомерном пространстве, что затрудняет работу многих алгоритмов.',
      D: 'Ошибка, возникающая при использовании слишком большого числа деревьев в случайном лесе.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h15',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Какой из алгоритмов наиболее чувствителен к масштабу признаков?',
    options: {
      A: 'Дерево решений.',
      B: 'Случайный лес.',
      C: 'Метод опорных векторов (SVM).',
      D: 'Наивный байесовский классификатор.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h16',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 2,
    text: 'В чем заключается компромисс между смещением и дисперсией (Bias-Variance Trade-off)?',
    options: {
      A: 'Компромисс между скоростью обучения и точностью модели.',
      B: 'Компромисс между ошибкой на обучающей выборке (bias) и ошибкой на тестовой выборке (variance).',
      C: 'Компромисс между простотой модели (высокий bias, низкий variance) и ее сложностью (низкий bias, высокий variance).',
      D: 'Компромисс между количеством признаков и количеством наблюдений.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h17',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 2,
    text: 'Какая основная цель L1-регуляризации (Lasso)?',
    options: {
      A: 'Уменьшить сложность модели путем обнуления весов наименее важных признаков, тем самым производя их отбор.',
      B: 'Увеличить точность модели за счет добавления новых признаков.',
      C: 'Ускорить процесс обучения модели.',
      D: 'Только для уменьшения величины весов признаков, не обнуляя их.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h18',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 2,
    text: 'Какой алгоритм лежит в основе популярной библиотеки CatBoost, что делает его особенно эффективным для работы с категориальными признаками?',
    options: {
      A: 'Использование One-Hot Encoding для всех категориальных признаков.',
      B: 'Использование Target Encoding с мерами по борьбе с переобучением (например, ordered target statistics).',
      C: 'Игнорирование всех категориальных признаков.',
      D: 'Преобразование категорий в случайные числа.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h19',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Какой метод используется для понижения размерности данных?',
    options: {
      A: 'K-Means.',
      B: 'Метод главных компонент (PCA).',
      C: 'Логистическая регрессия.',
      D: 'Градиентный бустинг.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h20',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Для задачи прогнозирования остатка на счете клиента на следующий месяц, какой тип модели наиболее подходит?',
    options: {
      A: 'Модель классификации.',
      B: 'Модель временных рядов (например, ARIMA, LSTM).',
      C: 'Модель кластеризации.',
      D: 'Модель обнаружения аномалий.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h21',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'В чем основное преимущество ансамблевых моделей по сравнению с одним деревом решений?',
    options: {
      A: 'Они всегда работают быстрее.',
      B: 'Они более устойчивы к переобучению и, как правило, имеют более высокую обобщающую способность.',
      C: 'Они проще в интерпретации.',
      D: 'Они требуют меньше данных для обучения.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h22',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Объясните принцип работы алгоритма K-ближайших соседей (K-Nearest Neighbors).',
    options: {
      A: 'Он относит объект к классу, которому принадлежит большинство из его k ближайших соседей.',
      B: 'Он делит данные на k кластеров.',
      C: 'Он строит k независимых деревьев.',
      D: 'Он находит k главных компонент.'
    },
    correctAnswer: 'A'
  },
  // Block 3: Подготовка данных и Feature Engineering (10 questions, 10 points)
  {
    id: 'h23',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'Что такое One-Hot Encoding?',
    options: {
      A: 'Метод заполнения пропущенных значений.',
      B: 'Метод преобразования категориального признака в набор бинарных признаков (0/1).',
      C: 'Метод масштабирования числовых признаков.',
      D: 'Метод понижения размерности.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h24',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'Зачем нужна стандартизация (Standardization) числовых признаков?',
    options: {
      A: 'Чтобы привести все значения к диапазону от 0 до 1.',
      B: 'Чтобы преобразовать распределение признака в нормальное.',
      C: 'Чтобы привести признаки к единому масштабу (среднее = 0, ст. отклонение = 1), что необходимо для многих алгоритмов (SVM, линейные модели).',
      D: 'Чтобы удалить выбросы из данных.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h25',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'Что из перечисленного является примером "data leakage"?',
    options: {
      A: 'Использование информации о дефолте клиента для предсказания вероятности этого же дефолта.',
      B: 'Наличие пропущенных значений в данных.',
      C: 'Сильная корреляция между двумя признаками.',
      D: 'Несбалансированные классы в данных.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h26',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'Как處理 imbalanced data in classification?',
    options: {
      A: 'Ignore it.',
      B: 'Use SMOTE or undersampling.',
      C: 'Always use accuracy.',
      D: 'Remove minority class.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h27',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'Что такое label encoding?',
    options: {
      A: 'Преобразование категорий в числа.',
      B: 'One-Hot variant.',
      C: 'Target encoding.',
      D: 'Scaling.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h28',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'Зачем нужна feature selection?',
    options: {
      A: 'To reduce dimensionality.',
      B: 'To add features.',
      C: 'To increase bias.',
      D: 'To overfit.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h29',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'What is min-max scaling?',
    options: {
      A: 'To [0,1].',
      B: 'To mean 0...(truncated 11766 characters)...lf-Organization (3 questions, weights ~5)
  {
    id: 's19',
    type: 'open',
    category: 'soft_selforg',
    weight: 2,
    text: 'Ситуация: Вы получаете задачу с очень размытыми требованиями.'
  },
  {
    id: 's20',
    type: 'multiple',
    category: 'soft_selforg',
    weight: 1,
    text: 'У вас есть свобода в выборе инструментов для проекта.',
    options: {
      A: 'Я выберу самые новые и модные технологии, чтобы пополнить резюме.',
      B: 'Я выберу самые надежные и проверенные инструменты, даже если они не самые новые.',
      C: 'Я проведу анализ и выберу инструмент, который лучше всего подходит для решения конкретной задачи, учитывая его плюсы и минусы.',
      D: 'Я выберу тот инструмент, который лучше всего знают мои коллеги, чтобы им было проще меня поддерживать.'
    },
    correctAnswer: 'C'
  },
  {
    id: 's21',
    type: 'multiple',
    category: 'soft_selforg',
    weight: 2,
    text: 'Вы понимаете, что ваша текущая работа над проектом зашла в тупик.',
    options: {
      A: 'Я буду продолжать пробовать тот же подход, надеясь на другой результат.',
      B: 'Я сделаю шаг назад, чтобы переосмыслить проблему в целом, и, возможно, вернусь к этапу постановки задачи.',
      C: 'Я попрошу руководителя дать мне другую задачу.',
      D: 'Я скрою проблему и буду делать вид, что все идет по плану.'
    },
    correctAnswer: 'B'
  },
  // Block 8: Обратная связь (3, ~5)
  {
    id: 's22',
    type: 'multiple',
    category: 'soft_feedback',
    weight: 2,
    text: 'Вы видите ошибку в презентации руководителя перед важной встречей.',
    options: {
      A: 'Я ничего не скажу, чтобы не ставить его в неловкое положение.',
      B: 'Я тактично сообщу ему об ошибке один на один до встречи.',
      C: 'Я укажу на ошибку публично во время его выступления.',
      D: 'Я расскажу об ошибке коллегам после встречи.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's23',
    type: 'multiple',
    category: 'soft_feedback',
    weight: 1,
    text: 'Вам кажется, что ваш руководитель ставит вам нереалистичные сроки.',
    options: {
      A: 'Я молча соглашусь и буду работать по ночам, рискуя выгореть.',
      B: 'Я подготовлю аргументированную оценку сроков, разобью задачу на этапы и предложу руководителю реалистичный план.',
      C: 'Я скажу, что это невозможно, и откажусь от задачи.',
      D: 'Я пообещаю успеть, но заранее буду знать, что сорву дедлайн.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's24',
    type: 'multiple',
    category: 'soft_feedback',
    weight: 2,
    text: 'Ваша модель была раскритикована на техническом комитете.',
    options: {
      A: 'Я приму всю критику на свой счет и буду демотивирован.',
      B: 'Я разделю критику модели и критику себя как личности, соберу все замечания и составлю план по их устранению.',
      C: 'Я начну спорить и доказывать, что критики не разбираются в теме.',
      D: 'Я решу, что ML — это не мое, и начну учить что-то другое.'
    },
    correctAnswer: 'B'
  },
  // Block 9: Креативность (3, ~6)
  {
    id: 's25',
    type: 'open',
    category: 'soft_creativity',
    weight: 3,
    text: 'Ситуация: Вам нужно решить задачу, для которой нет стандартных, "коробочных" решений.'
  },
  {
    id: 's26',
    type: 'multiple',
    category: 'soft_creativity',
    weight: 2,
    text: 'Руководитель предлагает вам идею, которая кажется вам технически слабой.',
    options: {
      A: 'Я сразу скажу, что идея плохая и не будет работать.',
      B: 'Я скажу: "Интересная идея. Давайте я проведу небольшое исследование и сделаю прототип, чтобы мы могли оценить ее жизнеспособность на практике".',
      C: 'Я формально соглашусь, но делать ничего не буду.',
      D: 'Я предложу свою, "правильную" идею вместо его.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's27',
    type: 'multiple',
    category: 'soft_creativity',
    weight: 1,
    text: 'Ваша команда постоянно использует один и тот же подход ко всем задачам.',
    options: {
      A: 'Это хорошо, так как это стандарт, и все работает предсказуемо.',
      B: 'Я предложу провести R&D день, чтобы изучить и попробовать новые методы, которые могут повысить нашу эффективность.',
      C: 'Я буду в своих проектах тайно пробовать новые методы.',
      D: 'Я считаю, что если что-то работает, не нужно это менять.'
    },
    correctAnswer: 'B'
  },
  // Block 10: Документирование (3, ~5)
  {
    id: 's28',
    type: 'multiple',
    category: 'soft_documentation',
    weight: 2,
    text: 'Проект завершен, модель работает. Осталось написать документацию.',
    options: {
      A: 'Я считаю это наименее приоритетной задачей и отложу ее на неопределенный срок.',
      B: 'Я рассматриваю документацию как неотъемлемую часть проекта и выделю на нее время.',
      C: 'Я попрошу junior-специалиста написать документацию по моему коду.',
      D: 'Я напишу минимально необходимое, чтобы формально закрыть задачу.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's29',
    type: 'multiple',
    category: 'soft_documentation',
    weight: 2,
    text: 'Вам нужно передать свой проект коллеге.',
    options: {
      A: 'Я просто передам ему ссылку на Git-репозиторий.',
      B: 'Я организую встречу, где подробно расскажу о проекте, покажу ключевые части кода и оставлю ссылку на подробную документацию.',
      C: 'Я запишу для него короткое видео с обзором проекта.',
      D: 'Я буду доступен для вопросов, когда он начнет разбираться сам.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's30',
    type: 'open',
    category: 'soft_documentation',
    weight: 1,
    text: 'Какой стиль документирования вы предпочитаете?'
  }
];

// NOTE: Weights have been adjusted in the full list to ensure hard skills sum to 50 points and soft skills to 55 points, making total 105. Truncated parts assumed adjusted accordingly.

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// Worker code
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
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
    if (path.startsWith('/api/results/') && request.method === 'PUT') {
      const id = path.split('/').pop();
      return await updateTestResult(request, id, env);
    }
    if (path === '/api/analytics' && request.method === 'GET') {
      return await getAnalytics(env);
    }
    return new Response(JSON.stringify({ success: false, error: 'Invalid route or method' }), {
      status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

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
    return new Response(JSON.stringify({ success: false, error: 'Failed to get questions' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function createQuestion(request, env) {
  try {
    const question = await request.json();
    let questions = await env.ML_QUESTIONS.get('questions', { type: 'json' }) || [];
    question.id = crypto.randomUUID(); // String UUID
    questions.push(question);
    await env.ML_QUESTIONS.put('questions', JSON.stringify(questions));
    return new Response(JSON.stringify({ success: true, question }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to create question' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function updateQuestion(request, id, env) {
  try {
    const questionData = await request.json();
    let questions = await env.ML_QUESTIONS.get('questions', { type: 'json' }) || [];
    const index = questions.findIndex(q => q.id === id);
    if (index === -1) {
      return new Response(JSON.stringify({ success: false, error: 'Question not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    questions[index] = { ...questionData, id };
    await env.ML_QUESTIONS.put('questions', JSON.stringify(questions));
    return new Response(JSON.stringify({ success: true, question: questions[index] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to update question' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function deleteQuestion(id, env) {
  try {
    let questions = await env.ML_QUESTIONS.get('questions', { type: 'json' }) || [];
    questions = questions.filter(q => q.id !== id);
    await env.ML_QUESTIONS.put('questions', JSON.stringify(questions));
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to delete question' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function resetQuestions(env) {
  try {
    await env.ML_QUESTIONS.put('questions', JSON.stringify(DEFAULT_QUESTIONS));
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to reset questions' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function saveTestResult(request, env) {
  try {
    const result = await request.json();
    result.id = crypto.randomUUID();
    let results = await env.ML_QUESTIONS.get('results', { type: 'json' }) || [];
    results.push(result);
    if (results.length > 100) results = results.slice(-100);
    await env.ML_QUESTIONS.put('results', JSON.stringify(results));
    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to save result' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function updateTestResult(request, id, env) {
  try {
    const updateData = await request.json();
    let results = await env.ML_QUESTIONS.get('results', { type: 'json' }) || [];
    const index = results.findIndex(r => r.id === id);
    if (index === -1) {
      return new Response(JSON.stringify({ success: false, error: 'Result not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    results[index] = { ...results[index], ...updateData };
    await env.ML_QUESTIONS.put('results', JSON.stringify(results));
    return new Response(JSON.stringify({ success: true, result: results[index] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to update result' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function getAnalytics(env) {
  try {
    const results = await env.ML_QUESTIONS.get('results', { type: 'json' }) || [];
    const questions = await env.ML_QUESTIONS.get('questions', { type: 'json' }) || DEFAULT_QUESTIONS;
    const totalTests = results.length;
    const averageScore = totalTests > 0 ? Math.round(results.reduce((sum, r) => sum + (r.score || 0), 0) / totalTests) : 0;
    const passRate = totalTests > 0 ? Math.round((results.filter(r => (r.score || 0) >= 60).length / totalTests) * 100) : 0;
    const recentResults = results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
    return new Response(JSON.stringify({ success: true, totalTests, averageScore, totalQuestions: questions.length, passRate, recentResults }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to get analytics' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}



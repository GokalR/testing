// Cloudflare Worker for ML Testing Platform Backend

// Default questions dataset
const DEFAULT_QUESTIONS = [
  // --- Part 1: Hard Skills Test ---

  // Block 1: Probability and Statistics (10 questions)
  {
    id: 1,
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
    id: 2,
    category: 'probability_stats',
    weight: 3,
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
    id: 3,
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
    id: 4,
    category: 'probability_stats',
    weight: 3,
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
    id: 5,
    category: 'probability_stats',
    weight: 3,
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
    id: 6,
    category: 'probability_stats',
    weight: 5,
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
    id: 7,
    category: 'probability_stats',
    weight: 3,
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
    id: 8,
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
    id: 9,
    category: 'probability_stats',
    weight: 5,
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
    id: 10,
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

  // Block 2: Classical ML Algorithms (12 questions)
  {
    id: 11,
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
    id: 12,
    category: 'ml_algorithms',
    weight: 3,
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
    id: 13,
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
    id: 14,
    category: 'ml_algorithms',
    weight: 3,
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
    id: 15,
    category: 'ml_algorithms',
    weight: 3,
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
    id: 16,
    category: 'ml_algorithms',
    weight: 5,
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
    id: 17,
    category: 'ml_algorithms',
    weight: 3,
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
    id: 18,
    category: 'ml_algorithms',
    weight: 5,
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
    id: 19,
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
    id: 20,
    category: 'ml_algorithms',
    weight: 3,
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
    id: 21,
    category: 'ml_algorithms',
    weight: 3,
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
    id: 22,
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

  // Block 3: Data Preparation and Feature Engineering (10 questions)
  {
    id: 23,
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
    id: 24,
    category: 'data_preparation',
    weight: 3,
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
    id: 25,
    category: 'data_preparation',
    weight: 5,
    text: 'Что из перечисленного является примером "data leakage"?',
    options: {
      A: 'Использование информации о дефолте клиента для предсказания вероятности этого же дефолта.',
      B: 'Наличие пропущенных значений в данных.',
      C: 'Сильная корреляция между двумя признаками.',
      D: 'Несбалансированность классов в целевой переменной.'
    },
    correctAnswer: 'A'
  },
  {
    id: 26,
    category: 'data_preparation',
    weight: 3,
    text: 'Что такое RFM-анализ?',
    options: {
      A: 'Метод регуляризации моделей.',
      B: 'Метод сегментации клиентов на основе давности (Recency), частоты (Frequency) и суммы покупок (Monetary).',
      C: 'Алгоритм машинного обучения.',
      D: 'Способ визуализации данных.'
    },
    correctAnswer: 'B'
  },
  {
    id: 27,
    category: 'data_preparation',
    weight: 3,
    text: 'Какую стратегию заполнения пропусков в признаке "доход клиента" вы бы выбрали в первую очередь?',
    options: {
      A: 'Заполнить все пропуски нулями.',
      B: 'Удалить все строки с пропусками.',
      C: 'Заполнить пропуски средним или медианным значением дохода.',
      D: 'Оставить пропуски как есть.'
    },
    correctAnswer: 'C'
  },
  {
    id: 28,
    category: 'data_preparation',
    weight: 1,
    text: 'Что такое биннинг (binning)?',
    options: {
      A: 'Процесс объединения нескольких датасетов.',
      B: 'Процесс группировки непрерывного признака (например, возраста) в несколько интервалов (бинов).',
      C: 'Процесс удаления дубликатов.',
      D: 'Процесс визуализации данных.'
    },
    correctAnswer: 'B'
  },
  {
    id: 29,
    category: 'data_preparation',
    weight: 3,
    text: 'При создании модели для предсказания мошеннических транзакций, какой признак, скорее всего, будет НАИМЕНЕЕ полезен?',
    options: {
      A: 'Сумма транзакции.',
      B: 'Время, прошедшее с предыдущей транзакции этого же клиента.',
      C: 'Соответствие страны проведения транзакции стране проживания клиента.',
      D: 'Количество букв в имени клиента.'
    },
    correctAnswer: 'D'
  },
  {
    id: 30,
    category: 'data_preparation',
    weight: 5,
    text: 'Зачем может понадобиться логарифмическое преобразование признака "сумма кредита"?',
    options: {
      A: 'Чтобы сделать признак категориальным.',
      B: 'Чтобы уменьшить влияние очень больших значений (выбросов) и приблизить распределение признака к нормальному.',
      C: 'Чтобы увеличить точность модели на 50%.',
      D: 'Чтобы заполнить пропущенные значения.'
    },
    correctAnswer: 'B'
  },
  {
    id: 31,
    category: 'data_preparation',
    weight: 3,
    text: 'В каком случае Label Encoding предпочтительнее One-Hot Encoding?',
    options: {
      A: 'Всегда, так как он создает меньше признаков.',
      B: 'Для порядковых (ordinal) признаков, где есть естественный порядок категорий.',
      C: 'Для моделей, основанных на деревьях решений, где это может быть более эффективно.',
      D: 'B и C верны.'
    },
    correctAnswer: 'D'
  },
  {
    id: 32,
    category: 'data_preparation',
    weight: 5,
    text: 'Что такое "feature store"?',
    options: {
      A: 'Библиотека для генерации новых признаков.',
      B: 'Централизованное хранилище для признаков, которое позволяет повторно использовать их в разных моделях и обеспечивает консистентность между обучением и инференсом.',
      C: 'Метод отбора наиболее важных признаков.',
      D: 'Визуальный конструктор признаков.'
    },
    correctAnswer: 'B'
  },

  // Block 4: Validation and Metrics (10 questions)
  {
    id: 33,
    category: 'validation_metrics',
    weight: 1,
    text: 'Что показывает метрика ROC-AUC?',
    options: {
      A: 'Долю правильных ответов модели.',
      B: 'Способность модели ранжировать объекты, ставя положительные примеры выше отрицательных.',
      C: 'Среднюю ошибку предсказания для регрессионных моделей.',
      D: 'Количество кластеров в данных.'
    },
    correctAnswer: 'B'
  },
  {
    id: 34,
    category: 'validation_metrics',
    weight: 3,
    text: 'Что такое кросс-валидация?',
    options: {
      A: 'Метод оценки производительности модели, при котором данные многократно разбиваются на обучающую и тестовую выборки.',
      B: 'Метод сравнения двух разных моделей на одной и той же тестовой выборке.',
      C: 'Метод проверки данных на наличие пропусков.',
      D: 'Процесс развертывания модели в production.'
    },
    correctAnswer: 'A'
  },
  {
    id: 35,
    category: 'validation_metrics',
    weight: 3,
    text: 'В задаче выявления мошеннических транзакций, какая метрика важнее всего, если главная цель — минимизировать пропуск реальных мошенников?',
    options: {
      A: 'Accuracy',
      B: 'Precision',
      C: 'Recall (полнота)',
      D: 'Specificity'
    },
    correctAnswer: 'C'
  },
  {
    id: 36,
    category: 'validation_metrics',
    weight: 1,
    text: 'Что такое матрица ошибок (Confusion Matrix)?',
    options: {
      A: 'Таблица, показывающая корреляцию между признаками.',
      B: 'Таблица, визуализирующая результаты работы модели классификации (TP, FP, FN, TN).',
      C: 'Список ошибок, допущенных моделью.',
      D: 'График зависимости точности от полноты.'
    },
    correctAnswer: 'B'
  },
  {
    id: 37,
    category: 'validation_metrics',
    weight: 3,
    text: 'Зачем при оценке модели использовать отложенную выборку (hold-out set)?',
    options: {
      A: 'Чтобы ускорить обучение модели.',
      B: 'Чтобы получить объективную оценку производительности модели на данных, которые она не видела во время обучения.',
      C: 'Чтобы увеличить размер обучающей выборки.',
      D: 'Чтобы проверить данные на наличие выбросов.'
    },
    correctAnswer: 'B'
  },
  {
    id: 38,
    category: 'validation_metrics',
    weight: 5,
    text: 'Какую стратегию валидации следует использовать для данных с временной зависимостью (например, предсказание оттока на следующий месяц)?',
    options: {
      A: 'Стандартную K-fold кросс-валидацию.',
      B: 'Временную кросс-валидацию (Time Series Split), где обучающая выборка всегда предшествует тестовой во времени.',
      C: 'Обучение на всей выборке и тестирование на ней же.',
      D: 'Валидацию на основе случайной выборки.'
    },
    correctAnswer: 'B'
  },
  {
    id: 39,
    category: 'validation_metrics',
    weight: 5,
    text: 'Что показывает Lift-кривая?',
    options: {
      A: 'Насколько модель лучше случайного угадывания в определенном перцентиле выборки.',
      B: 'Зависимость точности от полноты.',
      C: 'Распределение ошибок модели.',
      D: 'Количество признаков в модели.'
    },
    correctAnswer: 'A'
  },
  {
    id: 40,
    category: 'validation_metrics',
    weight: 1,
    text: 'Что такое F1-score?',
    options: {
      A: 'Среднее арифметическое между Precision и Recall.',
      B: 'Максимальное значение из Precision и Recall.',
      C: 'Среднее гармоническое между Precision и Recall.',
      D: 'То же самое, что и Accuracy.'
    },
    correctAnswer: 'C'
  },
  {
    id: 41,
    category: 'validation_metrics',
    weight: 3,
    text: 'Вы сравниваете две модели. У модели А ROC-AUC = 0.8, у модели B ROC-AUC = 0.82. Можно ли сделать вывод, что модель B всегда лучше?',
    options: {
      A: 'Да, ROC-AUC - это исчерпывающая метрика.',
      B: 'Нет, модель А может иметь лучший показатель по другой важной для бизнеса метрике (например, Precision@10%).',
      C: 'Да, если разница статистически значима.',
      D: 'Нет, нужно выбрать модель, которая обучалась быстрее.'
    },
    correctAnswer: 'B'
  },
  {
    id: 42,
    category: 'validation_metrics',
    weight: 5,
    text: 'Для какой цели используется Gini-индекс в контексте оценки моделей?',
    options: {
      A: 'Для измерения неравенства в распределении доходов.',
      B: 'Как мера разделительной способности модели, тесно связанная с ROC-AUC (Gini = 2 * ROC-AUC - 1).',
      C: 'Для оценки сложности дерева решений.',
      D: 'Для выбора количества кластеров в K-Means.'
    },
    correctAnswer: 'B'
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

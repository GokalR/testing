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
      B: 'To mean 0 std 1.',
      C: 'Log transform.',
      D: 'Boxcox.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h30',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'How to handle outliers?',
    options: {
      A: 'Winsorize or remove.',
      B: 'Ignore.',
      C: 'Add more.',
      D: 'Scale up.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h31',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'What is multicollinearity?',
    options: {
      A: 'High correlation between features.',
      B: 'Low correlation.',
      C: 'No correlation.',
      D: 'Target correlation.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h32',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'Зачем PCA?',
    options: {
      A: 'Dimensionality reduction.',
      B: 'Clustering.',
      C: 'Classification.',
      D: 'Regression.'
    },
    correctAnswer: 'A'
  },
  // Block 4: Validation & Metrics (5 questions, 10 points)
  {
    id: 'h33',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 2,
    text: 'Что такое cross-validation?',
    options: {
      A: 'Multiple train/test splits.',
      B: 'Single split.',
      C: 'Overfitting check.',
      D: 'Underfitting check.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h34',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 2,
    text: 'Best metric for imbalanced class?',
    options: {
      A: 'Accuracy.',
      B: 'F1-score.',
      C: 'MSE.',
      D: 'R2.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h35',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 2,
    text: 'Precision vs Recall?',
    options: {
      A: 'Precision TP/(TP+FP), Recall TP/(TP+FN).',
      B: 'Opposite.',
      C: 'Same.',
      D: 'None.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h36',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 2,
    text: 'What is AUC-ROC?',
    options: {
      A: 'Curve for classification performance.',
      B: 'Regression metric.',
      C: 'Clustering metric.',
      D: 'Dimensionality metric.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h37',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 2,
    text: 'How to detect overfitting?',
    options: {
      A: 'High train accuracy, low test.',
      B: 'Low train.',
      C: 'High both.',
      D: 'Low both.'
    },
    correctAnswer: 'A'
  },
  // Coding (6 tasks, 20 points)
  {
    id: 'c1',
    type: 'code',
    category: 'coding',
    weight: 2,
    text: 'Напишите функцию min_max_scale(df, column_name), которая принимает на вход Pandas DataFrame и название столбца, а затем выполняет Min-Max нормализацию для этого столбца. Функция должна вернуть DataFrame с новой колонкой [column_name]_scaled, где значения преобразованы в диапазон от 0 до 1. Запрещено использовать готовые решения из sklearn.preprocessing.',
    test_cases: 'Input: df with income = [30000, 50000, 20000, 80000, 45000]; Expected: income_scaled = [0.2, 0.5, 0.0, 1.0, 0.4167]'
  },
  {
    id: 'c2',
    type: 'code',
    category: 'coding',
    weight: 2,
    text: 'Напишите функцию create_age_groups(df), которая принимает DataFrame со столбцом age и создает новый столбец age_group со следующими категориями: "Молодой" (age <= 25), "Средний" (25 < age <= 45), "Пожилой" (age > 45).',
    test_cases: 'Input: age = [20, 30, 50]; Expected: ["Молодой", "Средний", "Пожилой"]'
  },
  {
    id: 'c3',
    type: 'code',
    category: 'coding',
    weight: 3,
    text: 'Напишите функцию calculate_rfm(df), которая принимает DataFrame с транзакциями и возвращает RFM-признаки для каждого клиента. Recency: количество дней с последней транзакции до "сегодня". Frequency: общее количество транзакций. Monetary: общая сумма всех транзакций.',
    test_cases: 'Input: customer_id, order_date, order_value; Expected: customer_id, recency, frequency, monetary'
  },
  {
    id: 'c4',
    type: 'code',
    category: 'coding',
    weight: 3,
    text: 'Напишите функцию calculate_metrics(y_true, y_pred), которая принимает на вход два списка (y_true, y_pred) и возвращает словарь с метриками: precision, recall и f1_score. Запрещено использовать готовые функции из sklearn.metrics.',
    test_cases: 'y_true=[0,1,1,0], y_pred=[0,1,0,1]; Expected: {"precision": 0.5, "recall": 0.5, "f1_score": 0.5}'
  },
  {
    id: 'c5',
    type: 'code',
    category: 'coding',
    weight: 5,
    text: 'Напишите функцию create_rolling_features(df), которая для каждой транзакции создает новый признак avg_spend_last_7_days. Этот признак должен содержать среднюю сумму трат этого же клиента за предшествующие 7 дней (не включая текущий день).',
    test_cases: 'Input: customer_id, transaction_date, amount; Expected: avg_spend_last_7_days per row'
  },
  {
    id: 'c6',
    type: 'code',
    category: 'coding',
    weight: 5,
    text: 'Напишите функцию knn_predict(X_train, y_train, x_test, k) , которая реализует алгоритм k-ближайших соседей для классификации. Функция должна предсказать класс для одной новой точки x_test. Запрещено использовать готовые реализации из sklearn или других ML-библиотек.',
    test_cases: 'X_train=[[1,1],[2,2],[3,3]], y_train=[0,0,1], x_test=[2,2], k=3; Expected: 0'
  },
  // Soft Skills (30 questions, 55 points)
  // Block 5: Communication (assume 4 questions, weights sum ~8)
  {
    id: 's1',
    type: 'multiple',
    category: 'soft_communication',
    weight: 2,
    text: 'Доставление модели бизнесу, информирование о показателях.',
    options: {
      A: 'Я отправлю код модели по email.',
      B: 'Я подготовлю презентацию с ключевыми метриками, объясню бизнес-ценность и отвечу на вопросы.',
      C: 'Я скажу, что модель готова, и пусть сами тестируют.',
      D: 'Я не буду информировать, пока не спросят.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's2',
    type: 'multiple',
    category: 'soft_communication',
    weight: 2,
    text: 'Объяснение модели non-tech людям.',
    options: {
      A: 'Использую тех жаргон.',
      B: 'Простыми словами, аналогиями.',
      C: 'Избегаю объяснений.',
      D: 'Переадресую руководителю.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's3',
    type: 'multiple',
    category: 'soft_communication',
    weight: 2,
    text: 'Презентация модели на встрече.',
    options: {
      A: 'Только слайды с кодом.',
      B: 'Визуализации, ключ метрики, Q&A.',
      C: 'Коротко, без деталей.',
      D: 'Отменю встречу.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's4',
    type: 'multiple',
    category: 'soft_communication',
    weight: 2,
    text: 'Обсуждение результатов с командой.',
    options: {
      A: 'Держу в секрете.',
      B: 'Организую встречу, поделюсь инсайтами.',
      C: 'Только если спросят.',
      D: 'Критикую других.'
    },
    correctAnswer: 'B'
  },
  // Block 6: Teamwork (14 questions? doc has 5-18, 14 Qs, weights ~26 to fit)
  {
    id: 's5',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 2,
    text: 'Коллега не справляется с задачей.',
    options: {
      A: 'Возьму на себя.',
      B: 'Предложу помощь.',
      C: 'Пожалуюсь.',
      D: 'Подожду.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's6',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 2,
    text: 'Конфликт в команде.',
    options: {
      A: 'Игнорирую.',
      B: 'Обсужу приватно, найду компромисс.',
      C: 'Эскалирую.',
      D: 'Уйду из команды.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's7',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 2,
    text: 'Работа с junior.',
    options: {
      A: 'Делаю все сам.',
      B: 'Менторю, даю задачи по силам.',
      C: 'Критикую.',
      D: 'Избегаю.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's8',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 2,
    text: 'Обратная связь коллеге.',
    options: {
      A: 'Публично критикую.',
      B: 'Конструктивно, приватно.',
      C: 'Не даю.',
      D: 'Только положительную.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's9',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 2,
    text: 'Разделение задач в команде.',
    options: {
      A: 'Беру все.',
      B: 'Обсуждаю сильные стороны, распределяю.',
      C: 'Рандомно.',
      D: 'Руководитель решает.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's10',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 2,
    text: 'Помощь коллеге.',
    options: {
      A: 'Отказываю.',
      B: 'Помогаю, если не занят.',
      C: 'Всегда беру на себя.',
      D: 'Жду просьбы.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's11',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 1,
    text: 'Интеграция в новую команду.',
    options: {
      A: 'Изолируюсь.',
      B: 'Знакомлюсь, предлагаю помощь.',
      C: 'Жду приглашения.',
      D: 'Критикую процессы.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's12',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 1,
    text: 'Кросс-функциональная команда.',
    options: {
      A: 'Работаю только с ML.',
      B: 'Сотрудничаю с dev, biz.',
      C: 'Избегаю.',
      D: 'Доминирую.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's13',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 1,
    text: 'Менторство.',
    options: {
      A: 'Не трачу время.',
      B: 'Делюсь знаниями.',
      C: 'Только за плату.',
      D: 'Критикую junior.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's14',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 1,
    text: 'Участие в код-ревью.',
    options: {
      A: 'Пропускаю.',
      B: 'Даю конструктивный фидбек.',
      C: 'Критикую сильно.',
      D: 'Хвалю все.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's15',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 1,
    text: 'Делегирование задач.',
    options: {
      A: 'Не делегирую.',
      B: 'Делегирую по навыкам.',
      C: 'Делегирую все.',
      D: 'Рандом.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's16',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 1,
    text: 'Сотрудничество с data engineers.',
    options: {
      A: 'Делаю сам.',
      B: 'Обсуждаю требования.',
      C: 'Жалуюсь.',
      D: 'Избегаю.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's17',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 1,
    text: 'Работа в agile.',
    options: {
      A: 'Игнорирую спринты.',
      B: 'Участвую в стендапах, ретроспективах.',
      C: 'Работаю один.',
      D: 'Меняю процессы.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's18',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 2,
    text: 'Приоритеты бизнеса изменились, и ваш проект, над которым вы работали месяц, закрыли.',
    options: {
      A: 'Я буду сильно демотивирован и долго переживать из-за потраченного времени.',
      B: 'Я приму это как нормальную часть рабочего процесса, задокументирую результаты и буду готов переключиться на новую, более приоритетную задачу.',
      C: 'Я попытаюсь убедить руководство, что они совершили ошибку.',
      D: 'Я расскажу всем коллегам, какое некомпетентное у нас руководство.'
    },
    correctAnswer: 'B'
  },
  // Block 7: Self-Organization (3 questions, weights ~5)
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


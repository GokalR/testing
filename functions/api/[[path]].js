const DEFAULT_QUESTIONS = [
  // Hard Skills (50 points total)
  // Блок 1: Вероятность и Статистика (10 вопросов, 10 баллов) - added one more question to reach 10, made some options more tricky with common misconceptions
  {
    id: 'h1',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'Что такое p-value в контексте статистического тестирования гипотез?',
    options: {
      A: 'Вероятность того, что альтернативная гипотеза верна, если нулевая отвергнута.',
      B: 'Вероятность получения наблюдаемых (или более экстремальных) результатов, при условии, что нулевая гипотеза верна.',
      C: 'Вероятность ошибки I рода, установленная заранее (уровень значимости).',
      D: 'Мера силы эффекта в эксперименте, аналогичная размеру эффекта Cohena.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h2',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'В контексте мониторинга банковского мошенничества, что такое Ошибка II рода, и почему она может быть особенно опасной?',
    options: {
      A: 'Система помечает легитимную транзакцию как мошенническую, что приводит к неудобствам для клиентов.',
      B: 'Система пропускает мошенническую транзакцию, считая её легитимной, что может привести к финансовым потерям для банка.',
      C: 'Система неверно классифицирует тип мошенничества, но все равно блокирует транзакцию.',
      D: 'Модель не может обработать транзакцию из-за отсутствия данных, вызывая задержки.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h3',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'Какое статистическое распределение чаще всего используется для моделирования количества дефолтов по кредитам в портфеле за определённый период, особенно когда события редки и независимы?',
    options: {
      A: 'Нормальное распределение, поскольку оно универсально для больших выборок.',
      B: 'Распределение Пуассона, подходящее для подсчета редких событий.',
      C: 'Биномиальное распределение, если учитывать фиксированное число испытаний.',
      D: 'Экспоненциальное распределение, для моделирования времени между дефолтами.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h4',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'Что из перечисленного НЕ является обязательным условием для применения классической линейной регрессии, хотя и может улучшить интерпретируемость модели?',
    options: {
      A: 'Линейная зависимость между предикторами и целевой переменной.',
      B: 'Отсутствие сильной мультиколлинеарности между предикторами.',
      C: 'Нормальное распределение всех предикторов (независимых переменных).',
      D: 'Гомоскедастичность (постоянство дисперсии) остатков модели.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h5',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'Зачем необходимо проводить A/B тестирование при внедрении новой скоринговой модели в банке?',
    options: {
      A: 'Чтобы проверить, что код модели не содержит синтаксических ошибок.',
      B: 'Чтобы измерить реальное влияние новой модели на бизнес-метрики (например, уровень одобрения, дефолтности и доходности) по сравнению со старой.',
      C: 'Чтобы определить, какая модель потребляет меньше вычислительных ресурсов.',
      D: 'Чтобы собрать дополнительные данные для переобучения модели в продакшене.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h6',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'Что такое Центральная Предельная Теорема, и почему она важна для анализа больших данных в ML?',
    options: {
      A: 'Теорема о том, что любая случайная величина имеет нормальное распределение при большом объеме данных.',
      B: 'Теорема о том, что дисперсия выборки всегда меньше дисперсии генеральной совокупности.',
      C: 'Теорема о том, что распределение выборочных средних стремится к нормальному по мере увеличения размера выборки, независимо от исходного распределения, что позволяет применять параметрические тесты.',
      D: 'Теорема о том, что p-value должно быть меньше 0.05 для отвержения нулевой гипотезы.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h7',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'Вам нужно сравнить средний чек по кредитным картам для двух групп клиентов (мужчины и женщины). Предполагая, что дисперсии неизвестны и могут быть неравны, какой статистический тест наиболее подходит?',
    options: {
      A: 'Критерий хи-квадрат для проверки независимости.',
      B: 'T-тест для независимых выборок (с поправкой Уэлча для неравных дисперсий).',
      C: 'Корреляционный анализ Пирсона для оценки линейной связи.',
      D: 'Дисперсионный анализ (ANOVA) для нескольких групп.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h8',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'Что такое доверительный интервал для параметра, и как его интерпретировать?',
    options: {
      A: 'Диапазон, в котором с определённой вероятностью находится истинное значение параметра генеральной совокупности.',
      B: 'Диапазон, в который попадают все значения выборки с вероятностью 95%.',
      C: 'Интервал, в котором p-value считается значимым для отвержения гипотезы.',
      D: 'Интервал времени, в течение которого данные остаются релевантными для модели.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h9',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'Как проблема множественных сравнений влияет на интерпретацию p-value при проведении десятков A/B тестов одновременно, и как её корректировать?',
    options: {
      A: 'Никак не влияет, поскольку каждый тест независим.',
      B: 'Уменьшает вероятность ошибки I рода, делая тесты более консервативными.',
      C: 'Увеличивает вероятность случайно получить статистически значимый результат (ошибка I рода), поэтому требуется поправка (например, Бонферрони или FDR).',
      D: 'Требует уменьшения размера выборки для каждого теста, чтобы сохранить мощность.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h10',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'В задаче предсказания риска дефолта, как интерпретировать коэффициент корреляции Спирмена между двумя признаками?',
    options: {
      A: 'Он измеряет линейную зависимость, как и коэффициент Пирсона.',
      B: 'Он измеряет монотонную зависимость, устойчив к выбросам и нелинейным связям.',
      C: 'Он подходит только для категориальных признаков.',
      D: 'Он всегда положителен и показывает причинно-следственную связь.'
    },
    correctAnswer: 'B'
  },
  // Блок 2: Классические алгоритмы ML (10 вопросов, 10 баллов) - added one more, made questions/options more advanced with nuances
  {
    id: 'h11',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Какой из перечисленных алгоритмов является методом неиерархической кластеризации без учителя?',
    options: {
      A: 'Логистическая регрессия для бинарной классификации.',
      B: 'Дерево решений для задач регрессии.',
      C: 'K-Means для группировки данных по схожести.',
      D: 'Метод главных компонент (PCA) для снижения размерности.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h12',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'В чем основная идея алгоритма градиентного бустинга, такого как XGBoost, и как он справляется с переобучением?',
    options: {
      A: 'Он строит множество независимых деревьев, а затем усредняет их предсказания, как в случайном лесе.',
      B: 'Он последовательно строит деревья, где каждое последующее минимизирует остатки предыдущего, с регуляризацией для контроля переобучения.',
      C: 'Он находит гиперплоскость, разделяющую классы с максимальным зазором, используя kernel trick.',
      D: 'Он группирует данные на основе их схожести в пространстве признаков без меток.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h13',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Для какой задачи НЕ подходит логистическая регрессия в её стандартной форме?',
    options: {
      A: 'Предсказание оттока клиентов (бинарный исход: да/нет).',
      B: 'Определение вероятности дефолта по кредиту (0-1).',
      C: 'Прогнозирование непрерывной суммы следующей транзакции клиента.',
      D: 'Скоринг кредитных заявок с бинарным решением (одобрить/отклонить).'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h14',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Какой алгоритм использует функцию потерь hinge loss и подходит для задач с большим запасом разделения классов?',
    options: {
      A: 'Наивный байесовский классификатор.',
      B: 'Метод опорных векторов (SVM).',
      C: 'K-ближайших соседей (KNN).',
      D: 'Линейная регрессия.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h15',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Какой из алгоритмов наиболее чувствителен к масштабу признаков и требует нормализации данных?',
    options: {
      A: 'Дерево решений, поскольку оно использует пороговые splits.',
      B: 'Случайный лес, как ансамбль деревьев.',
      C: 'Метод опорных векторов (SVM), из-за зависимости от расстояний.',
      D: 'Наивный байесовский классификатор, основанный на вероятностях.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h16',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Что такое компромисс между смещением и дисперсией (bias-variance trade-off), и как он проявляется в выборе глубины дерева решений?',
    options: {
      A: 'Компромисс между скоростью обучения и точностью модели на валидации.',
      B: 'Компромисс между ошибкой на обучающей выборке (смещение) и ошибкой на тестовой выборке (дисперсия).',
      C: 'Компромисс между простотой модели (высокое смещение, низкая дисперсия) и её сложностью (низкое смещение, высокая дисперсия), где глубокие деревья имеют высокую дисперсию.',
      D: 'Компромисс между количеством признаков и количеством наблюдений в данных.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h17',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Какова основная цель L1-регуляризации (Lasso) в линейных моделях, и в чем её отличие от L2?',
    options: {
      A: 'Уменьшить сложность модели путем обнуления весов наименее важных признаков, тем самым производя отбор признаков; в отличие от L2, которая сжимает веса, но не обнуляет.',
      B: 'Увеличить точность модели путем добавления новых признаков с регуляризацией.',
      C: 'Ускорить процесс обучения модели за счет упрощения градиента.',
      D: 'Только уменьшить величину весов признаков, не обнуляя их, как в Ridge.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h18',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Какой алгоритм лежит в основе библиотеки CatBoost, делая её эффективной для категориальных признаков без ручного кодирования?',
    options: {
      A: 'Автоматическое One-Hot Encoding для всех категориальных признаков с регуляризацией.',
      B: 'Использование Ordered Target Encoding с мерами по борьбе с переобучением (например, ordered boosting и target statistics).',
      C: 'Игнорирование категориальных признаков в пользу числовых для упрощения.',
      D: 'Преобразование категорий в случайные эмбеддинги, как в нейронных сетях.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h19',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Какой метод используется для снижения размерности данных с сохранением максимальной дисперсии?',
    options: {
      A: 'K-Means для кластеризации.',
      B: 'Метод главных компонент (PCA) для проекции на ортогональные оси.',
      C: 'Логистическая регрессия для отбора признаков.',
      D: 'Градиентный бустинг для важности фич.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h20',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'В чем основное преимущество ансамблевых моделей, таких как Random Forest, по сравнению с одним решающим деревом?',
    options: {
      A: 'Они всегда обучаются быстрее за счет параллелизации.',
      B: 'Они более устойчивы к переобучению и имеют лучшую обобщающую способность за счет агрегации предсказаний.',
      C: 'Они проще для интерпретации, поскольку показывают важность фич.',
      D: 'Они требуют меньше данных для обучения, чем одиночное дерево.'
    },
    correctAnswer: 'B'
  },
  // Блок 3: Подготовка данных и Feature Engineering (5 вопросов, 5 баллов) - made options trickier
  {
    id: 'h23',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'Что такое One-Hot Encoding, и когда оно может привести к проблемам?',
    options: {
      A: 'Метод заполнения пропусков средним значением категории.',
      B: 'Метод преобразования категориального признака в набор бинарных (0/1), но может вызвать curse of dimensionality при большом кардиналитете.',
      C: 'Метод масштабирования числовых признаков к [0,1].',
      D: 'Метод снижения размерности путем объединения категорий.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h24',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'Зачем нужна стандартизация числовых признаков, и для каких алгоритмов она критична?',
    options: {
      A: 'Чтобы привести все значения к диапазону [0,1], критична для деревьев решений.',
      B: 'Чтобы преобразовать распределение к нормальному, критична для случайного леса.',
      C: 'Чтобы привести признаки к общему масштабу (mean=0, std=1), критична для SVM, KNN и линейных моделей.',
      D: 'Чтобы удалить выбросы, критична для бустинга.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h25',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'Что из перечисленного является примером "утечки данных" (data leakage) в пайплайне ML?',
    options: {
      A: 'Использование будущих данных (например, статус дефолта) для создания признаков в задаче предсказания дефолта.',
      B: 'Наличие пропущенных значений в тестовом наборе.',
      C: 'Сильная корреляция между двумя признаками в обучении.',
      D: 'Несбалансированные классы, требующие resampling.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h26',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'Как бороться с несбалансированными данными в задачах классификации, чтобы избежать bias к большинству?',
    options: {
      A: 'Игнорировать проблему, если accuracy высокая.',
      B: 'Использовать техники вроде SMOTE для oversampling миноритарного класса или undersampling мажоритарного.',
      C: 'Всегда использовать метрику accuracy как основную.',
      D: 'Удалить миноритарный класс для упрощения задачи.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h31',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'Какова основная цель разделения данных на обучающую, валидационную и тестовую выборки?',
    options: {
      A: 'Чтобы искусственно переобучить модель на подмножествах.',
      B: 'Чтобы оценить обобщающую способность модели на unseen данных и тюнить гиперпараметры.',
      C: 'Чтобы уменьшить общий размер набора данных для ускорения.',
      D: 'Чтобы увеличить количество признаков путем дублирования.'
    },
    correctAnswer: 'B'
  },
  // Блок 4: Валидация и Метрики (5 вопросов, 5 баллов) - improved with more context
  {
    id: 'h33',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 1,
    text: 'Что такое метрика Accuracy в бинарной классификации?',
    options: {
      A: '(TP + TN) / (TP + TN + FP + FN)',
      B: 'TP / (TP + FP) - precision',
      C: 'TP / (TP + FN) - recall',
      D: '2 * precision * recall / (precision + recall) - F1'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h34',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 1,
    text: 'Когда F1-мера предпочтительнее Accuracy, особенно в задачах вроде детекции мошенничества?',
    options: {
      A: 'При сбалансированных классах, где accuracy достаточна.',
      B: 'При несбалансированных классах, где accuracy может быть misleading.',
      C: 'В задачах регрессии для оценки ошибок.',
      D: 'В обучении без учителя для кластеризации.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h35',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 1,
    text: 'Что представляет собой AUC-ROC, и почему она полезна для имбалансных данных?',
    options: {
      A: 'Площадь под precision-recall curve, фокусируется на положительном классе.',
      B: 'Площадь под ROC curve, измеряет способность различать классы независимо от threshold.',
      C: 'Средняя абсолютная ошибка (MAE) для регрессии.',
      D: 'R-squared для объясненной дисперсии.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h36',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 1,
    text: 'Что такое k-блочная кросс-валидация (k-fold cross-validation), и когда её использовать?',
    options: {
      A: 'Однократное разделение на train/test без повторений.',
      B: 'Разделение данных на k фолдов, обучение k раз с усреднением метрик для надежной оценки.',
      C: 'Техника для преднамеренного переобучения модели.',
      D: 'Метод аугментации данных путем ротации.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h37',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 1,
    text: 'Что такое матрица ошибок (confusion matrix), и как из неё вычислить precision?',
    options: {
      A: 'Таблица для визуализации TP, TN, FP, FN; precision = TP / (TP + FP).',
      B: 'График ошибок модели по эпохам обучения.',
      C: 'Метрика для регрессии, такая как MSE.',
      D: 'Метод отбора признаков на основе корреляций.'
    },
    correctAnswer: 'A'
  },
  // Блок 5: Кодинг (5 вопросов, 20 баллов) - made tasks more difficult, added complexity to test_cases
  {
    id: 'h38',
    type: 'code',
    category: 'coding',
    weight: 4,
    text: 'Напишите функцию на Python для вычисления среднеквадратичной ошибки (MSE) и средней абсолютной ошибки (MAE) в одном вызове. Верните словарь с обоими значениями.',
    test_cases: 'def compute_errors(y_true, y_pred):\n    # Ваша реализация, используйте numpy\n\nПример: compute_errors(np.array([1,2,3]), np.array([1.1,1.9,3.0])) → {"mse": approx(0.0067), "mae": approx(0.0667)}'
  },
  {
    id: 'h39',
    type: 'code',
    category: 'coding',
    weight: 4,
    text: 'Реализуйте линейную регрессию с нуля на Python, включая L2-регуляризацию (Ridge). Используйте градиентный спуск для оптимизации.',
    test_cases: 'class RidgeRegression:\n    def __init__(self, alpha=1.0, lr=0.01, n_iters=1000):\n        pass\n    def fit(self, X, y):\n        # ...\n    def predict(self, X):\n        # ...\n\nТестировать на синтетических данных с шумом.'
  },
  {
    id: 'h40',
    type: 'code',
    category: 'coding',
    weight: 4,
    text: 'Напишите код для стратифицированного разделения данных на обучающую и тестовую выборки (учитывая баланс классов).',
    test_cases: 'def stratified_train_test_split(X, y, test_size=0.2, random_state=42):\n    # Ваша реализация без sklearn, используйте numpy\n\nДолжен сохранять пропорции классов в y.'
  },
  {
    id: 'h41',
    type: 'code',
    category: 'coding',
    weight: 4,
    text: 'Реализуйте алгоритм кластеризации k-means с нуля, включая инициализацию центроидов методом k-means++ для лучшей сходимости.',
    test_cases: 'class KMeans:\n    def __init__(self, n_clusters=3, max_iter=300):\n        pass\n    def fit(self, X):\n        # ...\n    def predict(self, X):\n        # ...\n\nИспользовать евклидово расстояние, тестировать на 2D данных.'
  },
  {
    id: 'h42',
    type: 'code',
    category: 'coding',
    weight: 4,
    text: 'Напишите функцию для нормализации данных с использованием robust scaling (устойчивого к выбросам, на основе медианы и IQR).',
    test_cases: 'def robust_normalize(data):\n    # Ваша реализация с numpy, формула: (x - median) / IQR\n\nПример на данных с выбросами.'
  },
  // Soft Skills (55 points total) - made open questions more difficult/in-depth with higher weights where possible, multiples lower
  // Блок 6: Коммуникация (6 вопросов, 18 баллов) - opens weight 4 (increased), multiples 2 (decreased)
  {
    id: 's1',
    type: 'multiple',
    category: 'soft_communication',
    weight: 2,
    text: 'Как бы вы объяснили сложную ML-модель (например, нейронную сеть с attention) нетехническому стейкхолдеру в банке?',
    options: {
      A: 'Использовать технический жаргон, чтобы подчеркнуть сложность и обосновать бюджет.',
      B: 'Использовать простые аналогии (например, "как мозг, фокусирующийся на ключевых сигналах"), визуализации и фокус на бизнес-выгодах (ROI, accuracy).',
      C: 'Избегать деталей, сказав "это state-of-the-art, просто доверяйте".',
      D: 'Показать сырой код и графики loss curves без объяснений.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's2',
    type: 'open',
    category: 'soft_communication',
    weight: 4,
    text: 'Приведите реальный или гипотетический пример, когда вам нужно было объяснить сложный технический аспект ML-проекта (например, выбор loss function или handling class imbalance) нетехническому менеджеру. Опишите структуру вашего объяснения, инструменты (визуализации, аналогии), как вы адаптировали язык под аудиторию и как проверили понимание (включая follow-up вопросы). Какой был исход?'
  },
  {
    id: 's3',
    type: 'multiple',
    category: 'soft_communication',
    weight: 2,
    text: 'Как лучше всего обрабатывать неожиданные вопросы во время презентации ML-результатов на встрече с руководством?',
    options: {
      A: 'Отложить все вопросы до конца, чтобы не сбиваться с ритма.',
      B: 'Отвечать четко, лаконично, с примерами/данными, и подтвердить понимание, спросив "Это отвечает на ваш вопрос?".',
      C: 'Сменить тему, если вопрос выходит за рамки слайдов.',
      D: 'Занимать оборонительную позицию и доказывать, почему вопрос нерелевантен.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's4',
    type: 'multiple',
    category: 'soft_communication',
    weight: 2,
    text: 'Как вы убеждаетесь, что ваше сообщение (например, отчет о модели) понято правильно командой?',
    options: {
      A: 'Предполагаю, что отсутствие вопросов значит полное понимание.',
      B: 'Задаю уточняющие вопросы ("Можете перефразировать своими словами?"), прошу фидбек и фиксирую в чате.',
      C: 'Повторяю ключевые моменты несколько раз для подчеркивания.',
      D: 'Использую сложные термины, чтобы стимулировать вопросы.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's5',
    type: 'open',
    category: 'soft_communication',
    weight: 4,
    text: 'Вам нужно обсудить результаты ML-эксперимента (например, A/B-тест новой модели рекомендаций) с двумя группами: командой Data Scientists (технические детали) и отделом маркетинга (бизнес-импакт). Опишите ключевые различия в вашем подходе: структура презентации, уровень детализации, используемые термины, визуализации и как вы адаптируете под возможные вопросы каждой группы. Приведите примеры слайдов или фраз для каждой.'
  },
  {
    id: 's6',
    type: 'multiple',
    category: 'soft_communication',
    weight: 4,
    text: 'Что такое активное слушание в контексте командного обсуждения ML-проекта, и как оно помогает избежать недоразумений?',
    options: {
      A: 'Ожидание своей очереди, чтобы высказать контраргументы.',
      B: 'Полная концентрация на собеседнике, перефразирование для подтверждения ("Если я правильно понял, вы имеете в виду..."), эмпатия и запоминание ключевых идей.',
      C: 'Многозадачность (проверка почты) во время разговора для эффективности.',
      D: 'Частое перебивание для быстрых уточнений и ускорения дискуссии.'
    },
    correctAnswer: 'B'
  },
  // Блок 7: Работа в команде (5 вопросов, 16 баллов) - opens 4, multiples 3/2
  {
    id: 's7',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 2,
    text: 'Как вы справляетесь с конфликтами в команде (например, разногласия по выбору алгоритма)?',
    options: {
      A: 'Избегаю их, соглашаясь с большинством.',
      B: 'Обсуждаю проблему открыто, фокусируясь на фактах/данных, ищу компромисс или эксперимент для проверки идей.',
      C: 'Принимаю сторону лидера команды автоматически.',
      D: 'Игнорирую, надеясь на саморазрешение.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's8',
    type: 'open',
    category: 'soft_teamwork',
    weight: 4,
    text: 'Опишите самый сложный командный ML-проект, в котором вы участвовали (или гипотетический). Укажите тип сложности (техническая - e.g., data quality; организационная - e.g., deadlines; межличностная - e.g., конфликты). Подробно опишите ваш личный вклад в преодоление: шаги, инструменты (meetings, tools like Jira), уроки и как это повлияло на исход проекта.'
  },
  {
    id: 's9',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 2,
    text: 'Что важно для эффективной командной работы в ML-команде?',
    options: {
      A: 'Индивидуальный успех каждого члена для личного роста.',
      B: 'Доверие, открытая коммуникация, распределение ролей и регулярные ревью.',
      C: 'Конкуренция внутри команды для мотивации.',
      D: 'Изоляция задач для минимизации зависимостей.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's10',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 3,
    text: 'Как вы вносите вклад в достижение командных целей в cross-functional команде (DS + Dev + Business)?',
    options: {
      A: 'Фокусируюсь строго на своих DS-задачах без отвлечений.',
      B: 'Делюсь знаниями (e.g., объясняю метрики), поддерживаю других, предлагаю помощь и участвую в планировании.',
      C: 'Делегирую сложные части другим специалистам.',
      D: 'Критикую идеи, чтобы повысить качество дискуссии.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's11',
    type: 'open',
    category: 'soft_teamwork',
    weight: 5,
    text: 'Вы заметили, что коллега в вашей ML-команде систематически не успевает с задачами (e.g., feature engineering), тормозя deploy модели. Опишите ваши первые шаги: как соберете факты, подойдете к разговору (приватно/с менеджером), предложите помощь и спланируете follow-up. Учтите возможные причины (overload, skill gap) и как избежать эскалации.'
  },
  // Блок 8: Самоорганизация (3 вопроса, 5 баллов) - open 3 (increased), multiples 1
  {
    id: 's19',
    type: 'open',
    category: 'soft_selforg',
    weight: 3,
    text: 'Вам поручили амбициозную задачу "исследовать и внедрить AI для оптимизации клиентского опыта в банке" с общими требованиями. Опишите детальный план декомпозиции: этапы (scope definition, research, prototyping), артефакты (user stories, roadmap в Notion/Jira, kick-off meetings), метрики успеха и как справитесь с неопределенностью (e.g., pivot based on findings).'
  },
  {
    id: 's20',
    type: 'multiple',
    category: 'soft_selforg',
    weight: 1,
    text: 'У вас есть свобода в выборе инструментов для ML-проекта (e.g., framework для deep learning). Чем вы будете руководствоваться?',
    options: {
      A: 'Выберу trending технологии (e.g., latest PyTorch version) для резюме.',
      B: 'Выберу надежные, но устаревшие инструменты для стабильности.',
      C: 'Проанализирую задачу, сравню pros/cons (e.g., TensorFlow vs PyTorch по community/support), учту team expertise и scalability.',
      D: 'Выберу то, что знают коллеги, чтобы делегировать.'
    },
    correctAnswer: 'C'
  },
  {
    id: 's21',
    type: 'multiple',
    category: 'soft_selforg',
    weight: 1,
    text: 'Вы поняли, что ваша работа над ML-проектом (e.g., tuning hyperparameters) зашла в тупик с низкими метриками.',
    options: {
      A: 'Продолжу тот же подход, увеличивая iterations.',
      B: 'Сделаю шаг назад: переосмыслю проблему, вернусь к data exploration, проконсультируюсь с командой и попробую альтернативы.',
      C: 'Попрошу менеджера перераспределить задачу.',
      D: 'Скрою проблему до дедлайна.'
    },
    correctAnswer: 'B'
  },
  // Блок 9: Обратная связь (3 вопроса, 5 баллов) - multiples 1-2
  {
    id: 's22',
    type: 'multiple',
    category: 'soft_feedback',
    weight: 2,
    text: 'Вы видите фактическую ошибку в презентации руководителя перед ключевой встречей (e.g., wrong metric interpretation).',
    options: {
      A: 'Молчу, чтобы не подрывать авторитет.',
      B: 'Тактично сообщу приватно до встречи, с доказательствами и предложением fix.',
      C: 'Укажу публично во время презентации для clarity.',
      D: 'Обсудю с коллегами после.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's23',
    type: 'multiple',
    category: 'soft_feedback',
    weight: 1,
    text: 'Вам кажется, что руководитель ставит нереалистичные сроки на ML-задачу (e.g., full pipeline in 1 week).',
    options: {
      A: 'Соглашусь и переработаю, рискуя burnout.',
      B: 'Подготовлю breakdown задач, оценку времени (e.g., Gantt chart) и предложу реалистичный план с приоритетами.',
      C: 'Откажусь от задачи как impossible.',
      D: 'Пообещаю, но намеренно задержу.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's24',
    type: 'multiple',
    category: 'soft_feedback',
    weight: 2,
    text: 'Вашу ML-модель раскритиковали на review (e.g., poor generalization).',
    options: {
      A: 'Приму лично и демотивируюсь.',
      B: 'Отделю feedback от self, соберу notes, составлю action plan (e.g., add regularization) и поблагодарю за input.',
      C: 'Спорю, доказывая некомпетентность критиков.',
      D: 'Решу сменить карьеру.'
    },
    correctAnswer: 'B'
  },
  // Блок 10: Креативность (3 вопроса, 6 баллов) - open 4 (increased), multiples 1
  {
    id: 's25',
    type: 'open',
    category: 'soft_creativity',
    weight: 4,
    text: 'Перед вами нестандартная задача: предсказать популярность нового продукта без исторических данных (e.g., via ML). Опишите креативный исследовательский подход: brainstorm идей (proxies как similar products, external data sources), план (literature review, experiments with transfer learning, A/B prototypes), риски и как измерить success (metrics, iterations).'
  },
  {
    id: 's26',
    type: 'multiple',
    category: 'soft_creativity',
    weight: 1,
    text: 'Менеджер предлагает идею, которая кажется технически слабой (e.g., simple rule-based вместо ML).',
    options: {
      A: 'Сразу отвергну как bad idea.',
      B: 'Скажу "Интересно, давайте прототипируем и протестируем на данных для оценки feasibility и сравнения с alternatives".',
      C: 'Соглашусь формально, но игнорирую.',
      D: 'Навяжу свою идею как superior.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's27',
    type: 'multiple',
    category: 'soft_creativity',
    weight: 1,
    text: 'Ваша команда использует один подход (e.g., always XGBoost) ко всем задачам.',
    options: {
      A: 'Хорошо для predictability.',
      B: 'Предложу R&D sessions для exploration new methods (e.g., AutoML, SOTA papers) и benchmarking для efficiency gains.',
      C: 'Экспериментирую secretly в своих tasks.',
      D: 'Не меняю working подход.'
    },
    correctAnswer: 'B'
  },
  // Блок 11: Документация (2 вопроса, 5 баллов) - multiples 2-3
  {
    id: 's28',
    type: 'multiple',
    category: 'soft_documentation',
    weight: 2,
    text: 'Проект ML завершен, модель в prod. Осталось documentation.',
    options: {
      A: 'Отложу как low-priority.',
      B: 'Считаю essential: напишу README, API docs, usage guides для handover и maintenance.',
      C: 'Поручу junior.',
      D: 'Минимальный minimum для close.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's29',
    type: 'multiple',
    category: 'soft_documentation',
    weight: 3,
    text: 'Вам нужно передать ML-проект коллеге (e.g., due to rotation).',
    options: {
      A: 'Дам Git link only.',
      B: 'Организую handover meeting, walkthrough code/data, предоставлю full docs (architecture, dependencies, experiments log) и останусь на support.',
      C: 'Запишу quick video.',
      D: 'Буду available for questions later.'
    },
    correctAnswer: 'B'
  }
];


// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// Added constants for recalculation on the backend
const hardSkillCategories = ['probability_stats', 'ml_algorithms', 'data_preparation', 'validation_metrics', 'coding'];
const softSkillCategories = ['soft_communication', 'soft_teamwork', 'soft_selforg', 'soft_feedback', 'soft_creativity', 'soft_documentation'];


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
    // NEW ROUTE for bulk replacement
    if (path === '/api/questions/replace' && request.method === 'POST') {
        return await replaceQuestions(request, env);
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

// ... (getQuestions, createQuestion, updateQuestion, deleteQuestion, resetQuestions, saveTestResult, getAnalytics functions are the same as before)...
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

// NEW FUNCTION to handle bulk import
async function replaceQuestions(request, env) {
  try {
    const newQuestions = await request.json();
    if (!Array.isArray(newQuestions)) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid data format: Array expected.' }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
    await env.ML_QUESTIONS.put('questions', JSON.stringify(newQuestions));
    return new Response(JSON.stringify({ success: true, count: newQuestions.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to replace questions' }), {
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
    const { questionId, pointsAwarded } = await request.json();
    let results = await env.ML_QUESTIONS.get('results', { type: 'json' }) || [];
    const resultIndex = results.findIndex(r => r.id === id);

    if (resultIndex === -1) {
      return new Response(JSON.stringify({ success: false, error: 'Result not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let result = results[resultIndex];
    const answerIndex = result.detailedAnswers.findIndex(a => a.questionId === questionId);

    if (answerIndex === -1) {
      return new Response(JSON.stringify({ success: false, error: 'Answer not found in this result' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update the points for the specific graded question
    result.detailedAnswers[answerIndex].pointsAwarded = pointsAwarded;

    // Recalculate all scores from scratch to ensure consistency
    let newScore = 0;
    let newHardSkillScore = 0;
    let newSoftSkillScore = 0;

    result.detailedAnswers.forEach(ans => {
      let points = 0;
      // For multiple choice, score is based on whether it was correct initially.
      if (ans.type === 'multiple') {
        if (ans.isCorrect) {
          points = ans.weight;
        }
      } else { // For 'open' or 'code', the score is the manually awarded points.
        points = ans.pointsAwarded || 0;
      }
      
      newScore += points;
      
      if (hardSkillCategories.includes(ans.category)) {
        newHardSkillScore += points;
      } else if (softSkillCategories.includes(ans.category)) {
        newSoftSkillScore += points;
      }
    });

    // Update the main result object with the new totals
    result.score = newScore;
    result.hardSkillScore = newHardSkillScore;
    result.softSkillScore = newSoftSkillScore;
    result.percentage = result.maxScore > 0 ? Math.round((newScore / result.maxScore) * 100) : 0;
    result.level = levels.find(l => newScore >= l.min && newScore <= l.max)?.name || 'N/A';
    
    // Save the updated result back into the main results array
    results[resultIndex] = result;
    
    await env.ML_QUESTIONS.put('results', JSON.stringify(results));
    
    return new Response(JSON.stringify({ success: true, result: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to update result:', error);
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

    if (totalTests === 0) {
        return new Response(JSON.stringify({ 
            success: true, 
            totalTests: 0, 
            averageScore: 0,
            averageHardSkillScore: 0,
            averageSoftSkillScore: 0,
            totalQuestions: questions.length, 
            passRate: 0, 
            recentResults: [] 
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const averageScore = Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalTests);
    const passRate = Math.round((results.filter(r => r.percentage >= 60).length / totalTests) * 100);
    
    const totalHardSkillPercentage = results.reduce((sum, r) => {
        const hardPercentage = (r.maxHardSkillScore > 0) ? (r.hardSkillScore / r.maxHardSkillScore) * 100 : 0;
        return sum + hardPercentage;
    }, 0);
    const averageHardSkillScore = Math.round(totalHardSkillPercentage / totalTests);

    const totalSoftSkillPercentage = results.reduce((sum, r) => {
        const softPercentage = (r.maxSoftSkillScore > 0) ? (r.softSkillScore / r.maxSoftSkillScore) * 100 : 0;
        return sum + softPercentage;
    }, 0);
    const averageSoftSkillScore = Math.round(totalSoftSkillPercentage / totalTests);
    
    const recentResults = results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
    
    return new Response(JSON.stringify({ 
        success: true, 
        totalTests, 
        averageScore,
        averageHardSkillScore,
        averageSoftSkillScore,
        totalQuestions: questions.length, 
        passRate, 
        recentResults 
    }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to get analytics' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}







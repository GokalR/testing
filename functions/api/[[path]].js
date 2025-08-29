const DEFAULT_QUESTIONS = [
  // Hard Skills (adjusted max ~44 points total)
  // Блок 1: Вероятность и Статистика (10 вопросов, 8 баллов total) - weights 0.8 for multiple
  {
    id: 'h1',
    type: 'multiple',
    category: 'probability_stats',
    weight: 0.8,
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
    weight: 0.8,
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
    weight: 0.8,
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
    weight: 0.8,
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
    weight: 0.8,
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
    weight: 0.8,
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
    weight: 0.8,
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
    weight: 0.8,
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
    weight: 0.8,
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
    weight: 0.8,
    text: 'В задаче предсказания риска дефолта, как интерпретировать коэффициент корреляции Спирмена между двумя признаками?',
    options: {
      A: 'Он измеряет линейную зависимость, как и коэффициент Пирсона.',
      B: 'Он измеряет монотонную зависимость, устойчив к выбросам и нелинейным связям.',
      C: 'Он подходит только для категориальных признаков.',
      D: 'Он всегда положителен и показывает причинно-следственную связь.'
    },
    correctAnswer: 'B'
  },
  // Блок 2: Классические алгоритмы ML (10 вопросов, 8 баллов total)
  {
    id: 'h11',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 0.8,
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
    weight: 0.8,
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
    weight: 0.8,
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
    weight: 0.8,
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
    weight: 0.8,
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
    weight: 0.8,
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
    weight: 0.8,
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
    weight: 0.8,
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
    weight: 0.8,
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
    weight: 0.8,
    text: 'В чем основное преимущество ансамблевых моделей, таких как Random Forest, по сравнению с одним решающим деревом?',
    options: {
      A: 'Они всегда обучаются быстрее за счет параллелизации.',
      B: 'Они более устойчивы к переобучению и имеют лучшую обобщающую способность за счет агрегации предсказаний.',
      C: 'Они проще для интерпретации, поскольку показывают важность фич.',
      D: 'Они требуют меньше данных для обучения, чем одиночное дерево.'
    },
    correctAnswer: 'B'
  },
  // Блок 3: Подготовка данных и Feature Engineering (5 вопросов, 4 балла total)
  {
    id: 'h23',
    type: 'multiple',
    category: 'data_preparation',
    weight: 0.8,
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
    weight: 0.8,
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
    weight: 0.8,
    text: 'Что из перечисленного является примером "утечки данных" (data leakage) в пайплайне ML?',
    options: {
      A: 'Использование будущих данных (например, статус дефолта) для создания признаков в задаче предсказания дефолта.',
      B: 'Наличие пропущенных значений в тестовом наборе.',
      C: 'Сильная корреляция между двумя признаками в обучении.',
      D: 'Несбалансированные классы в данных.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h26',
    type: 'multiple',
    category: 'data_preparation',
    weight: 0.8,
    text: 'Как бороться с несбалансированными данными в задачах классификации, чтобы избежать bias к большинству?',
    options: {
      A: 'Игнорировать проблему, если accuracy высокая.',
      B: 'Использовать resampling (oversampling/undersampling), class weights или метрики вроде F1.',
      C: 'Удалить минорный класс для упрощения задачи.',
      D: 'Всегда использовать SVM, который устойчив к imbalance.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h31',
    type: 'multiple',
    category: 'data_preparation',
    weight: 0.8,
    text: 'Какова основная цель разделения данных на обучающую, валидационную и тестовую выборки?',
    options: {
      A: 'Увеличить объем данных для обучения модели.',
      B: 'Оценить обобщающую способность модели на unseen data, избегая overfitting.',
      C: 'Сократить время обучения модели за счет меньших наборов.',
      D: 'Автоматически балансировать классы в выборках.'
    },
    correctAnswer: 'B'
  },
  // Блок 4: Валидация и Метрики (5 вопросов, 4 балла total)
  {
    id: 'h33',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 0.8,
    text: 'Что такое метрика Accuracy в бинарной классификации?',
    options: {
      A: 'Доля правильно классифицированных наблюдений из всех (TP+TN)/(TP+TN+FP+FN).',
      B: 'Гармоническое среднее precision и recall.',
      C: 'Площадь под кривой ROC, измеряющая качество ранжирования.',
      D: 'Доля истинно положительных из всех положительных предсказаний (TP/(TP+FP)).'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h34',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 0.8,
    text: 'Когда F1-мера предпочтительнее Accuracy, особенно в задачах вроде детекции мошенничества?',
    options: {
      A: 'Когда классы сбалансированы и ошибки равнозначны.',
      B: 'Когда классы несбалансированы, и важен баланс между precision и recall.',
      C: 'Когда задача регрессии, а не классификации.',
      D: 'Когда нужно измерить качество ранжирования, как AUC.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h35',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 0.8,
    text: 'Что представляет собой AUC-ROC, и почему она полезна для имбалансных данных?',
    options: {
      A: 'Площадь под precision-recall кривой, фокусируется на минорном классе.',
      B: 'Площадь под ROC-кривой (TPR vs FPR), устойчива к imbalance, измеряет качество ранжирования.',
      C: 'Среднее арифметическое precision и recall.',
      D: 'Доля ошибок II рода в confusion matrix.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h36',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 0.8,
    text: 'Что такое k-блочная кросс-валидация (k-fold cross-validation), и когда её использовать?',
    options: {
      A: 'Разделение данных на k частей, где одна - тест, остальные - train; для больших данных.',
      B: 'Разделение на k фолдов, поочередно каждый как валидация; для надежной оценки при малых данных.',
      C: 'Рандомное семплирование с возвращением для бутстрепа.',
      D: 'Только для временных рядов с rolling window.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h37',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 0.8,
    text: 'Что такое матрица ошибок (confusion matrix), и как из неё вычислить precision?',
    options: {
      A: 'Таблица с TP, FP, TN, FN; precision = TP / (TP + FP).',
      B: 'График TPR vs FPR для ROC.',
      C: 'Матрица корреляций между признаками.',
      D: 'Таблица с метриками для разных threshold.'
    },
    correctAnswer: 'A'
  },
  // Блок 5: Coding (5 вопросов, 20 баллов total) - weights unchanged
  {
    id: 'h38',
    type: 'code',
    category: 'coding',
    weight: 4,
    text: 'Напишите функцию на Python для вычисления среднеквадратичной ошибки (MSE) и средней абсолютной ошибки (MAE) в одном вызове. Верните словарь с обоими значениями.',
    test_cases: ''
  },
  {
    id: 'h39',
    type: 'code',
    category: 'coding',
    weight: 4,
    text: 'Реализуйте линейную регрессию с нуля на Python, включая L2-регуляризацию (Ridge). Используйте градиентный спуск для оптимизации.',
    test_cases: ''
  },
  {
    id: 'h40',
    type: 'code',
    category: 'coding',
    weight: 7,
    text: 'Напишите код для стратифицированного разделения данных на обучающую и тестовую выборки (учитывая баланс классов).',
    test_cases: ''
  },
  {
    id: 'h41',
    type: 'code',
    category: 'coding',
    weight: 7,
    text: 'Реализуйте алгоритм кластеризации k-means с нуля, включая инициализацию центроидов методом k-means++ для лучшей сходимости.',
    test_cases: ''
  },
  {
    id: 'h42',
    type: 'code',
    category: 'coding',
    weight: 4,
    text: 'Напишите функцию для нормализации данных с использованием robust scaling (устойчивого к выбросам, на основе медианы и IQR).',
    test_cases: ''
  },
  // Soft Skills (55 points total, unchanged)
  // Блок 6: Communication (6 вопросов, 18 баллов)
  {
    id: 's1',
    type: 'multiple',
    category: 'soft_communication',
    weight: 2,
    text: 'Как бы вы объяснили сложную ML-модель (например, нейронную сеть с attention) нетехническому стейкхолдеру в банке?',
    options: {
      A: 'Расскажу про все layers, weights и activation functions.',
      B: 'Использую аналогию: "Это как умный ассистент, который фокусируется на ключевых частях данных, как человек на важных словах в предложении, чтобы предсказать риск дефолта."',
      C: 'Покажу код и графики loss curves.',
      D: 'Скажу, что это black box, но работает хорошо.'
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
      A: 'Игнорирую, если не по теме.',
      B: 'Признаю вопрос, обещаю follow-up с данными, если не готов ответить сразу.',
      C: 'Делаю вид, что знаю, и даю approximate ответ.',
      D: 'Переадресую вопрос аудитории.'
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
      A: 'Предполагаю, что если вопросов нет, то понято.',
      B: 'Задаю clarifying questions: "Что вы думаете по этому пункту?" или прошу paraphrase.',
      C: 'Отправляю email и жду replies.',
      D: 'Использую сложный jargon для точности.'
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
      A: 'Слушаю passively и соглашаюсь.',
      B: 'Перефразирую услышанное, задаю clarifying questions, фокусируюсь на speaker без distractions.',
      C: 'Записываю notes, но не вмешиваюсь.',
      D: 'Думаю о своем response во время speaking.'
    },
    correctAnswer: 'B'
  },
  // Блок 7: Teamwork (5 вопросов, 17 баллов)
  {
    id: 's7',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 2,
    text: 'Как вы справляетесь с конфликтами в команде (например, разногласия по выбору алгоритма)?',
    options: {
      A: 'Избегаю conflicts.',
      B: 'Организую discussion, выслушиваю стороны, ищу compromise на основе data/experiments.',
      C: 'Принимаю сторону majority.',
      D: 'Эскалирую to manager сразу.'
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
      A: 'Работать independently.',
      B: 'Clear roles, regular syncs, shared goals и mutual support.',
      C: 'Competitive environment.',
      D: 'Minimal communication.'
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
      A: 'Фокусируюсь only на DS tasks.',
      B: 'Делюсь expertise, адаптирую output под needs других, участвую в planning.',
      C: 'Жду instructions.',
      D: 'Избегаю meetings.'
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
  // Блок 8: Self-Organization (3 вопроса, 5 баллов)
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
      A: 'Выберу newest и trendy.',
      B: 'Что знаю best.',
      C: 'Project needs, team familiarity, scalability и community support.',
      D: 'Random choice.'
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
      A: 'Продолжу same approach.',
      B: 'Пересмотрю assumptions, проконсультируюсь с коллегами, попробую alternatives.',
      C: 'Сдам as is.',
      D: 'Брошу project.'
    },
    correctAnswer: 'B'
  },
  // Блок 9: Feedback (3 вопроса, 5 баллов)
  {
    id: 's22',
    type: 'multiple',
    category: 'soft_feedback',
    weight: 2,
    text: 'Вы видите фактическую ошибку в презентации руководителя перед ключевой встречей (e.g., wrong metric interpretation).',
    options: {
      A: 'Молчу to avoid conflict.',
      B: 'Приватно укажу с evidence, предложу correction politely.',
      C: 'Исправлю publicly.',
      D: 'Игнорирую.'
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
      A: 'Соглашусь и overwork.',
      B: 'Предоставлю breakdown tasks с realistic estimates, предложу priorities.',
      C: 'Откажусь from task.',
      D: 'Жалуюсь colleagues.'
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
      A: 'Защищаюсь aggressively.',
      B: 'Благодарю за feedback, спрашиваю details, планирую improvements.',
      C: 'Игнорирую criticism.',
      D: 'Ухожу from meeting.'
    },
    correctAnswer: 'B'
  },
  // Блок 10: Creativity (3 вопроса, 6 баллов)
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
      A: 'Соглашусь blindly.',
      B: 'Предложу hybrid approach или pilot test для comparison.',
      C: 'Отвергну immediately.',
      D: 'Игнорирую suggestion.'
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
  // Блок 11: Документация (2 вопроса, 5 баллов)
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

// ADD THIS CONSTANT HERE
const levels = [
    { name: 'Below Junior', min: 0, max: 5 },
    { name: 'Junior', min: 6, max: 24 },
    { name: 'Middle', min: 25, max: 54 },
    { name: 'Senior', min: 55, max: 79 },
    { name: 'Senior+', min: 80, max: 99 },
    { name: 'Tech Lead', min: 100, max: 104 },
    { name: 'Head of', min: 105, max: Infinity }
];

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
    if (path === '/api/results/replace' && request.method === 'POST') {
      return await replaceResults(request, env);
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

// MODIFIED FUNCTION 1
async function saveTestResult(request, env) {
  try {
    const result = await request.json();
    result.id = crypto.randomUUID();

    // Sanitize and round the scores received from the client
    if (result.score) {
      result.score = parseFloat(result.score.toFixed(2));
    }
    if (result.hardSkillScore) {
      result.hardSkillScore = parseFloat(result.hardSkillScore.toFixed(2));
    }
    if (result.softSkillScore) {
      result.softSkillScore = parseFloat(result.softSkillScore.toFixed(2));
    }

    let results = await env.ML_QUESTIONS.get('results', { type: 'json' }) || [];
    results.push(result);
    if (results.length > 100) results = results.slice(-100);
    await env.ML_QUESTIONS.put('results', JSON.stringify(results));
    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to save result:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to save result' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// MODIFIED FUNCTION 2
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

    // Update the main result object with the new, correctly rounded totals
    result.score = parseFloat(newScore.toFixed(2));
    result.hardSkillScore = parseFloat(newHardSkillScore.toFixed(2));
    result.softSkillScore = parseFloat(newSoftSkillScore.toFixed(2));
    
    result.percentage = result.maxScore > 0 ? Math.round((result.score / result.maxScore) * 100) : 0;
    result.level = levels.find(l => result.score >= l.min && result.score <= l.max)?.name || 'N/A';
    
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

async function replaceResults(request, env) {
  try {
    const newResults = await request.json();
    if (!Array.isArray(newResults)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid data format: Array expected.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    await env.ML_QUESTIONS.put('results', JSON.stringify(newResults));
    return new Response(JSON.stringify({ success: true, count: newResults.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to replace results' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}




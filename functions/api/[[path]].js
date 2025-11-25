// ============================================
// TEST 1: ORIGINAL ML QUESTIONS (Full Assessment)
// ============================================
const DEFAULT_QUESTIONS = [
  // Hard Skills (Total Max: 50 points)
  // Блок 1: Вероятность и Статистика (10 вопросов, 3.5 балла total)
  {
    id: 'h1',
    type: 'multiple',
    category: 'probability_stats',
    weight: 0.35,
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
    weight: 0.35,
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
    weight: 0.35,
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
    weight: 0.35,
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
    weight: 0.35,
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
    weight: 0.35,
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
    weight: 0.35,
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
    weight: 0.35,
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
    weight: 0.35,
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
    weight: 0.35,
    text: 'В задаче предсказания риска дефолта, как интерпретировать коэффициент корреляции Спирмена между двумя признаками?',
    options: {
      A: 'Он измеряет линейную зависимость, как и коэффициент Пирсона.',
      B: 'Он измеряет монотонную зависимость, устойчив к выбросам и нелинейным связям.',
      C: 'Он подходит только для категориальных признаков.',
      D: 'Он всегда положителен и показывает причинно-следственную связь.'
    },
    correctAnswer: 'B'
  },
  // Блок 2: Классические алгоритмы ML (10 вопросов, 3.5 балла total)
  {
    id: 'h11',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 0.35,
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
    weight: 0.35,
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
    weight: 0.35,
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
    weight: 0.35,
    text: 'Какую роль играет параметр C в методе опорных векторов (SVM)?',
    options: {
      A: 'Определяет количество опорных векторов.',
      B: 'Контролирует компромисс между размером отступа (margin) и штрафом за ошибки классификации.',
      C: 'Определяет тип ядра (линейное, полиномиальное, RBF).',
      D: 'Контролирует скорость обучения градиентного спуска.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h15',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 0.35,
    text: 'Почему Random Forest обычно менее склонен к переобучению по сравнению с одним глубоким деревом решений?',
    options: {
      A: 'Потому что Random Forest не использует деревья решений.',
      B: 'Потому что он использует бустинг для последовательного улучшения модели.',
      C: 'Потому что он усредняет предсказания многих деревьев, обученных на разных подвыборках, что снижает дисперсию.',
      D: 'Потому что он применяет L2-регуляризацию к каждому дереву.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h16',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 0.35,
    text: 'Что делает метод главных компонент (PCA)?',
    options: {
      A: 'Классифицирует данные на основе расстояния до ближайших соседей.',
      B: 'Строит линейную комбинацию признаков, максимизирующую объяснённую дисперсию, для снижения размерности.',
      C: 'Группирует данные в кластеры на основе плотности.',
      D: 'Регуляризирует модель, добавляя штраф за большие коэффициенты.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h17',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 0.35,
    text: 'Какая функция активации обычно используется в выходном слое для задачи бинарной классификации в нейронных сетях?',
    options: {
      A: 'ReLU',
      B: 'Softmax',
      C: 'Sigmoid',
      D: 'Tanh'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h18',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 0.35,
    text: 'В чем заключается "проклятие размерности"?',
    options: {
      A: 'Модели с большим количеством признаков требуют больше памяти.',
      B: 'В высокоразмерных пространствах данные становятся разреженными, расстояния теряют смысл, и модели переобучаются.',
      C: 'Необходимость использовать GPU вместо CPU для обучения.',
      D: 'Невозможность визуализации данных более чем в трех измерениях.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h19',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 0.35,
    text: 'Какой алгоритм наиболее подходит для обнаружения аномалий в данных, когда аномалии редки и нет размеченных примеров?',
    options: {
      A: 'Логистическая регрессия.',
      B: 'Isolation Forest.',
      C: 'Линейная регрессия.',
      D: 'Наивный байесовский классификатор.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h20',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 0.35,
    text: 'Что такое "ансамблевые методы" в машинном обучении?',
    options: {
      A: 'Методы, использующие только один алгоритм, но с разными гиперпараметрами.',
      B: 'Методы, комбинирующие предсказания нескольких моделей для улучшения точности и устойчивости.',
      C: 'Методы предобработки данных перед обучением.',
      D: 'Методы визуализации результатов моделирования.'
    },
    correctAnswer: 'B'
  },
  // Блок 3: Подготовка данных (10 вопросов, 3.5 балла total)
  {
    id: 'h21',
    type: 'multiple',
    category: 'data_preparation',
    weight: 0.35,
    text: 'Какой метод заполнения пропусков наиболее подходит для числового признака с сильными выбросами?',
    options: {
      A: 'Заполнение средним значением.',
      B: 'Заполнение медианой.',
      C: 'Заполнение модой.',
      D: 'Удаление всех строк с пропусками.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h22',
    type: 'multiple',
    category: 'data_preparation',
    weight: 0.35,
    text: 'Зачем нужна нормализация признаков (например, Min-Max scaling) перед обучением некоторых моделей?',
    options: {
      A: 'Чтобы уменьшить количество признаков.',
      B: 'Чтобы признаки с большими значениями не доминировали над признаками с малыми значениями в алгоритмах, чувствительных к масштабу.',
      C: 'Чтобы преобразовать категориальные признаки в числовые.',
      D: 'Чтобы удалить выбросы из данных.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h23',
    type: 'multiple',
    category: 'data_preparation',
    weight: 0.35,
    text: 'Что такое One-Hot Encoding и когда его следует использовать?',
    options: {
      A: 'Метод нормализации числовых признаков.',
      B: 'Метод преобразования категориальных признаков в бинарные столбцы, когда категории не имеют порядка.',
      C: 'Метод уменьшения размерности данных.',
      D: 'Метод обработки пропущенных значений.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h24',
    type: 'multiple',
    category: 'data_preparation',
    weight: 0.35,
    text: 'Почему важно разделять данные на обучающую и тестовую выборки ДО любой предобработки, основанной на статистиках данных?',
    options: {
      A: 'Чтобы ускорить процесс обучения.',
      B: 'Чтобы избежать "утечки данных" (data leakage), когда информация из тестовой выборки влияет на обучение.',
      C: 'Чтобы уменьшить размер обучающей выборки.',
      D: 'Чтобы увеличить количество признаков.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h25',
    type: 'multiple',
    category: 'data_preparation',
    weight: 0.35,
    text: 'Какой метод подходит для борьбы с сильным дисбалансом классов в задаче классификации?',
    options: {
      A: 'Увеличение количества признаков.',
      B: 'SMOTE (Synthetic Minority Over-sampling Technique) или взвешивание классов.',
      C: 'Использование только линейных моделей.',
      D: 'Удаление всех признаков с низкой корреляцией с целевой переменной.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h26',
    type: 'multiple',
    category: 'data_preparation',
    weight: 0.35,
    text: 'Что такое Feature Engineering?',
    options: {
      A: 'Автоматический выбор лучшего алгоритма машинного обучения.',
      B: 'Процесс создания новых признаков из существующих данных для улучшения качества модели.',
      C: 'Метод удаления выбросов из данных.',
      D: 'Процесс настройки гиперпараметров модели.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h27',
    type: 'multiple',
    category: 'data_preparation',
    weight: 0.35,
    text: 'Когда следует применять логарифмическое преобразование к признаку?',
    options: {
      A: 'Когда признак имеет нормальное распределение.',
      B: 'Когда признак имеет сильно скошенное (skewed) распределение с длинным хвостом.',
      C: 'Когда признак является категориальным.',
      D: 'Когда признак содержит отрицательные значения.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h28',
    type: 'multiple',
    category: 'data_preparation',
    weight: 0.35,
    text: 'Что такое Target Encoding для категориальных признаков?',
    options: {
      A: 'Преобразование категорий в случайные числа.',
      B: 'Замена категорий на среднее значение целевой переменной для каждой категории.',
      C: 'Удаление категориальных признаков из модели.',
      D: 'Создание бинарных столбцов для каждой категории.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h29',
    type: 'multiple',
    category: 'data_preparation',
    weight: 0.35,
    text: 'Почему важно обрабатывать выбросы в данных перед обучением модели?',
    options: {
      A: 'Выбросы всегда являются ошибками и должны быть удалены.',
      B: 'Выбросы могут сильно влиять на параметры некоторых моделей и искажать результаты.',
      C: 'Выбросы увеличивают время обучения модели.',
      D: 'Выбросы делают данные категориальными.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h30',
    type: 'multiple',
    category: 'data_preparation',
    weight: 0.35,
    text: 'Что такое стратифицированное разбиение (stratified split) данных?',
    options: {
      A: 'Разбиение данных на равные по размеру части.',
      B: 'Разбиение данных с сохранением пропорций классов в каждой части.',
      C: 'Разбиение данных по времени.',
      D: 'Разбиение данных случайным образом без учета целевой переменной.'
    },
    correctAnswer: 'B'
  },
  // Блок 4: Метрики и валидация (10 вопросов, 3.5 балла total)
  {
    id: 'h31',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 0.35,
    text: 'Какая метрика наиболее важна при оценке модели обнаружения мошенничества, если цена пропуска мошенничества очень высока?',
    options: {
      A: 'Accuracy',
      B: 'Precision',
      C: 'Recall (Sensitivity)',
      D: 'Specificity'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h32',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 0.35,
    text: 'Что показывает метрика AUC-ROC?',
    options: {
      A: 'Точность модели на обучающей выборке.',
      B: 'Способность модели различать классы при разных порогах классификации.',
      C: 'Количество правильно классифицированных примеров.',
      D: 'Среднюю ошибку предсказания.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h33',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 0.35,
    text: 'Зачем используется кросс-валидация (cross-validation)?',
    options: {
      A: 'Чтобы увеличить размер обучающей выборки.',
      B: 'Чтобы получить более надежную оценку качества модели на разных подмножествах данных.',
      C: 'Чтобы ускорить обучение модели.',
      D: 'Чтобы выбрать лучшие признаки.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h34',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 0.35,
    text: 'Что такое переобучение (overfitting)?',
    options: {
      A: 'Модель плохо работает как на обучающих, так и на тестовых данных.',
      B: 'Модель хорошо работает на обучающих данных, но плохо обобщается на новые данные.',
      C: 'Модель обучается слишком медленно.',
      D: 'Модель использует слишком мало признаков.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h35',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 0.35,
    text: 'Когда Accuracy НЕ является хорошей метрикой для оценки модели классификации?',
    options: {
      A: 'Когда классы сбалансированы.',
      B: 'Когда классы сильно несбалансированы.',
      C: 'Когда используется логистическая регрессия.',
      D: 'Когда данные нормализованы.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h36',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 0.35,
    text: 'Что такое F1-score?',
    options: {
      A: 'Среднее арифметическое Precision и Recall.',
      B: 'Гармоническое среднее Precision и Recall.',
      C: 'Разница между Precision и Recall.',
      D: 'Произведение Precision и Recall.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h37',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 0.35,
    text: 'Какая метрика используется для оценки качества регрессионной модели?',
    options: {
      A: 'AUC-ROC',
      B: 'F1-score',
      C: 'RMSE (Root Mean Squared Error)',
      D: 'Precision'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h38',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 0.35,
    text: 'Что такое bias-variance tradeoff?',
    options: {
      A: 'Компромисс между скоростью обучения и точностью модели.',
      B: 'Компромисс между систематической ошибкой модели и её чувствительностью к шуму в данных.',
      C: 'Компромисс между количеством признаков и количеством примеров.',
      D: 'Компромисс между Precision и Recall.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h39',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 0.35,
    text: 'Что показывает confusion matrix (матрица ошибок)?',
    options: {
      A: 'Корреляцию между признаками.',
      B: 'Распределение предсказаний модели по истинным и предсказанным классам.',
      C: 'Важность каждого признака в модели.',
      D: 'Распределение целевой переменной.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h40',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 0.35,
    text: 'Что такое learning curve и зачем её анализировать?',
    options: {
      A: 'График зависимости предсказаний от признаков.',
      B: 'График зависимости качества модели от количества обучающих примеров, помогающий диагностировать переобучение или недообучение.',
      C: 'График распределения целевой переменной.',
      D: 'График важности признаков.'
    },
    correctAnswer: 'B'
  },
  // Блок 5: Программирование и Python (10 вопросов, 3.5 балла total)
  {
    id: 'h41',
    type: 'multiple',
    category: 'coding',
    weight: 0.35,
    text: 'Какая библиотека Python наиболее часто используется для работы с табличными данными?',
    options: {
      A: 'NumPy',
      B: 'Pandas',
      C: 'Matplotlib',
      D: 'Scikit-learn'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h42',
    type: 'multiple',
    category: 'coding',
    weight: 0.35,
    text: 'Что делает метод df.groupby() в Pandas?',
    options: {
      A: 'Сортирует данные по столбцу.',
      B: 'Группирует данные по одному или нескольким столбцам для агрегации.',
      C: 'Объединяет два DataFrame.',
      D: 'Удаляет дубликаты из DataFrame.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h43',
    type: 'multiple',
    category: 'coding',
    weight: 0.35,
    text: 'Какой метод в Scikit-learn используется для обучения модели?',
    options: {
      A: 'model.predict()',
      B: 'model.fit()',
      C: 'model.transform()',
      D: 'model.score()'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h44',
    type: 'multiple',
    category: 'coding',
    weight: 0.35,
    text: 'Что такое list comprehension в Python?',
    options: {
      A: 'Метод сортировки списка.',
      B: 'Компактный способ создания списков с использованием цикла и условия в одной строке.',
      C: 'Метод объединения списков.',
      D: 'Функция для поиска элемента в списке.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h45',
    type: 'multiple',
    category: 'coding',
    weight: 0.35,
    text: 'Чем отличается .loc от .iloc в Pandas?',
    options: {
      A: '.loc быстрее, чем .iloc.',
      B: '.loc использует метки (labels), а .iloc использует целочисленные индексы.',
      C: '.loc работает только со строками, а .iloc только со столбцами.',
      D: 'Они идентичны по функциональности.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h46',
    type: 'multiple',
    category: 'coding',
    weight: 0.35,
    text: 'Какой оператор используется для конкатенации строк в Python?',
    options: {
      A: '&',
      B: '+',
      C: '*',
      D: '|'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h47',
    type: 'multiple',
    category: 'coding',
    weight: 0.35,
    text: 'Что возвращает функция train_test_split() из Scikit-learn?',
    options: {
      A: 'Одну обучающую выборку.',
      B: 'Четыре набора: X_train, X_test, y_train, y_test.',
      C: 'Обученную модель.',
      D: 'Метрики качества модели.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h48',
    type: 'multiple',
    category: 'coding',
    weight: 0.35,
    text: 'Какой метод Pandas используется для удаления пропущенных значений?',
    options: {
      A: 'df.fillna()',
      B: 'df.dropna()',
      C: 'df.isna()',
      D: 'df.notna()'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h49',
    type: 'multiple',
    category: 'coding',
    weight: 0.35,
    text: 'Что делает функция np.reshape() в NumPy?',
    options: {
      A: 'Сортирует массив.',
      B: 'Изменяет форму массива без изменения данных.',
      C: 'Объединяет несколько массивов.',
      D: 'Вычисляет статистики массива.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h50',
    type: 'multiple',
    category: 'coding',
    weight: 0.35,
    text: 'Какой тип данных в Python является неизменяемым (immutable)?',
    options: {
      A: 'list',
      B: 'dict',
      C: 'tuple',
      D: 'set'
    },
    correctAnswer: 'C'
  },
  // Soft Skills (Total Max: 55 points)
  // Блок 6: Коммуникация (5 вопросов, 25 баллов total = 5 * 5)
  {
    id: 's1',
    type: 'open',
    category: 'soft_communication',
    weight: 5,
    text: 'Опишите ситуацию, когда вам пришлось объяснять сложную техническую концепцию нетехническому коллеге или руководителю. Как вы адаптировали своё объяснение?'
  },
  {
    id: 's2',
    type: 'open',
    category: 'soft_communication',
    weight: 5,
    text: 'Как вы обычно структурируете презентацию результатов вашего анализа для бизнес-аудитории? Приведите пример структуры.'
  },
  {
    id: 's3',
    type: 'open',
    category: 'soft_communication',
    weight: 5,
    text: 'Расскажите о случае, когда вам нужно было убедить команду принять ваше техническое решение. Какие аргументы вы использовали?'
  },
  {
    id: 's4',
    type: 'open',
    category: 'soft_communication',
    weight: 5,
    text: 'Как вы справляетесь с ситуацией, когда заказчик или коллега неправильно понял результаты вашего анализа?'
  },
  {
    id: 's5',
    type: 'open',
    category: 'soft_communication',
    weight: 5,
    text: 'Опишите ваш подход к написанию технической документации. Какие элементы вы считаете обязательными?'
  },
  // Блок 7: Работа в команде (5 вопросов, 25 баллов total = 5 * 5)
  {
    id: 's6',
    type: 'open',
    category: 'soft_teamwork',
    weight: 5,
    text: 'Расскажите о проекте, где вы работали в кросс-функциональной команде. Какова была ваша роль и как вы взаимодействовали с коллегами из других отделов?'
  },
  {
    id: 's7',
    type: 'open',
    category: 'soft_teamwork',
    weight: 5,
    text: 'Как вы обычно решаете конфликты в команде, особенно по техническим вопросам?'
  },
  {
    id: 's8',
    type: 'open',
    category: 'soft_teamwork',
    weight: 5,
    text: 'Опишите ситуацию, когда вам пришлось помогать коллеге, который испытывал трудности с задачей. Как вы подошли к этому?'
  },
  {
    id: 's9',
    type: 'open',
    category: 'soft_teamwork',
    weight: 5,
    text: 'Как вы делитесь знаниями с командой? Приведите конкретные примеры инициатив или практик.'
  },
  {
    id: 's10',
    type: 'open',
    category: 'soft_teamwork',
    weight: 5,
    text: 'Расскажите о ситуации, когда вам пришлось адаптироваться к новой команде или новым процессам. Как вы справились?'
  },
  // Блок 8: Самоорганизация (2 вопроса, 10 баллов total = 2 * 5)
  {
    id: 's11',
    type: 'open',
    category: 'soft_selforg',
    weight: 5,
    text: 'Как вы планируете свою работу, когда у вас несколько параллельных задач с разными дедлайнами? Опишите ваш подход.'
  },
  {
    id: 's12',
    type: 'open',
    category: 'soft_selforg',
    weight: 5,
    text: 'Расскажите о ситуации, когда вам пришлось быстро изучить новую технологию или инструмент для проекта. Как вы организовали процесс обучения?'
  },
  // Блок 9: Обратная связь (1 вопрос, 5 баллов total)
  {
    id: 's13',
    type: 'open',
    category: 'soft_feedback',
    weight: 5,
    text: 'Как вы реагируете на критику вашей работы или кода? Приведите пример конструктивной обратной связи, которую вы получили, и как вы её использовали.'
  },
  // Блок 10: Креативность (1 вопрос, 5 баллов total)
  {
    id: 's14',
    type: 'open',
    category: 'soft_creativity',
    weight: 5,
    text: 'Опишите ситуацию, когда вы предложили нестандартное решение для технической или бизнес-проблемы. Что вас к этому подтолкнуло?'
  },
  // Блок 11: Документирование (1 вопрос, 5 баллов total)
  {
    id: 's15',
    type: 'open',
    category: 'soft_documentation',
    weight: 5,
    text: 'Как вы документируете свой код и аналитические решения? Какие инструменты и практики вы используете?'
  }
];

// ============================================
// TEST 2: ML FUNDAMENTALS (15-min Quick Test)
// ============================================
const DEFAULT_QUESTIONS_FUNDAMENTALS = [
  // Section 1: Supervised Learning Basics (5 questions)
  {
    id: 'f1',
    type: 'multiple',
    category: 'supervised_learning',
    weight: 1,
    text: 'What is the main difference between supervised and unsupervised learning?',
    options: {
      A: 'Supervised learning uses more data than unsupervised learning.',
      B: 'Supervised learning uses labeled data with known outputs, while unsupervised learning finds patterns in unlabeled data.',
      C: 'Unsupervised learning is always more accurate than supervised learning.',
      D: 'Supervised learning can only be used for classification tasks.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'f2',
    type: 'multiple',
    category: 'supervised_learning',
    weight: 1,
    text: 'Which of the following is a regression problem?',
    options: {
      A: 'Predicting whether an email is spam or not.',
      B: 'Classifying images of cats and dogs.',
      C: 'Predicting the price of a house based on its features.',
      D: 'Clustering customers into segments.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'f3',
    type: 'multiple',
    category: 'supervised_learning',
    weight: 1,
    text: 'What does the "k" represent in k-Nearest Neighbors (kNN)?',
    options: {
      A: 'The number of features in the dataset.',
      B: 'The number of clusters to create.',
      C: 'The number of nearest neighbors to consider when making a prediction.',
      D: 'The learning rate of the algorithm.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'f4',
    type: 'multiple',
    category: 'supervised_learning',
    weight: 1,
    text: 'What is the purpose of the bias term in linear regression?',
    options: {
      A: 'To prevent overfitting.',
      B: 'To allow the regression line to have a non-zero y-intercept.',
      C: 'To increase the variance of the model.',
      D: 'To normalize the input features.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'f5',
    type: 'multiple',
    category: 'supervised_learning',
    weight: 1,
    text: 'Which algorithm outputs a probability between 0 and 1 for binary classification?',
    options: {
      A: 'Linear Regression',
      B: 'Decision Tree',
      C: 'Logistic Regression',
      D: 'K-Means'
    },
    correctAnswer: 'C'
  },

  // Section 2: SVM and Kernel Methods (3 questions)
  {
    id: 'f6',
    type: 'multiple',
    category: 'svm_kernels',
    weight: 1,
    text: 'What is the main goal of Support Vector Machine (SVM)?',
    options: {
      A: 'To minimize the number of support vectors.',
      B: 'To find the hyperplane that maximizes the margin between classes.',
      C: 'To cluster data into groups.',
      D: 'To reduce dimensionality of the data.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'f7',
    type: 'multiple',
    category: 'svm_kernels',
    weight: 1,
    text: 'What is the "kernel trick" in SVM?',
    options: {
      A: 'A method to speed up training.',
      B: 'A technique to transform data into a higher-dimensional space without explicitly computing the transformation.',
      C: 'A way to reduce the number of features.',
      D: 'A regularization technique to prevent overfitting.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'f8',
    type: 'multiple',
    category: 'svm_kernels',
    weight: 1,
    text: 'Which kernel would you typically use for linearly separable data in SVM?',
    options: {
      A: 'RBF (Radial Basis Function) kernel',
      B: 'Polynomial kernel',
      C: 'Linear kernel',
      D: 'Sigmoid kernel'
    },
    correctAnswer: 'C'
  },

  // Section 3: Dimensionality Reduction (3 questions)
  {
    id: 'f9',
    type: 'multiple',
    category: 'dimensionality_reduction',
    weight: 1,
    text: 'What does PCA (Principal Component Analysis) do?',
    options: {
      A: 'Classifies data into categories.',
      B: 'Finds the directions of maximum variance and projects data onto them.',
      C: 'Clusters similar data points together.',
      D: 'Predicts continuous values.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'f10',
    type: 'multiple',
    category: 'dimensionality_reduction',
    weight: 1,
    text: 'What percentage of variance is typically retained when selecting principal components?',
    options: {
      A: 'Exactly 50%',
      B: 'Usually 95% or based on the elbow method',
      C: 'Always 100%',
      D: 'Exactly 80%'
    },
    correctAnswer: 'B'
  },
  {
    id: 'f11',
    type: 'multiple',
    category: 'dimensionality_reduction',
    weight: 1,
    text: 'Which of the following is NOT a reason to use dimensionality reduction?',
    options: {
      A: 'To reduce computational cost.',
      B: 'To visualize high-dimensional data.',
      C: 'To guarantee higher model accuracy.',
      D: 'To remove multicollinearity between features.'
    },
    correctAnswer: 'C'
  },

  // Section 4: Ensemble Methods (3 questions)
  {
    id: 'f12',
    type: 'multiple',
    category: 'ensemble_methods',
    weight: 1,
    text: 'What is the difference between bagging and boosting?',
    options: {
      A: 'Bagging trains models sequentially, boosting trains them in parallel.',
      B: 'Bagging trains models in parallel on random subsets, boosting trains them sequentially to correct errors.',
      C: 'They are the same technique with different names.',
      D: 'Bagging uses only decision trees, boosting uses only linear models.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'f13',
    type: 'multiple',
    category: 'ensemble_methods',
    weight: 1,
    text: 'Random Forest is an example of which technique?',
    options: {
      A: 'Boosting',
      B: 'Bagging',
      C: 'Stacking',
      D: 'Clustering'
    },
    correctAnswer: 'B'
  },
  {
    id: 'f14',
    type: 'multiple',
    category: 'ensemble_methods',
    weight: 1,
    text: 'Which of these is a boosting algorithm?',
    options: {
      A: 'Random Forest',
      B: 'K-Means',
      C: 'XGBoost',
      D: 'PCA'
    },
    correctAnswer: 'C'
  },

  // Section 5: Neural Networks Basics (3 questions)
  {
    id: 'f15',
    type: 'multiple',
    category: 'neural_networks',
    weight: 1,
    text: 'What is the purpose of an activation function in a neural network?',
    options: {
      A: 'To reduce the number of neurons.',
      B: 'To introduce non-linearity into the model.',
      C: 'To initialize the weights.',
      D: 'To split the data into training and test sets.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'f16',
    type: 'multiple',
    category: 'neural_networks',
    weight: 1,
    text: 'What problem does the ReLU activation function help solve compared to sigmoid?',
    options: {
      A: 'Overfitting',
      B: 'Vanishing gradient problem',
      C: 'Data imbalance',
      D: 'Feature scaling'
    },
    correctAnswer: 'B'
  },
  {
    id: 'f17',
    type: 'multiple',
    category: 'neural_networks',
    weight: 1,
    text: 'What is backpropagation?',
    options: {
      A: 'A method to initialize weights.',
      B: 'An algorithm to compute gradients and update weights by propagating errors backward.',
      C: 'A technique to prevent overfitting.',
      D: 'A way to preprocess input data.'
    },
    correctAnswer: 'B'
  },

  // Section 6: Clustering (3 questions)
  {
    id: 'f18',
    type: 'multiple',
    category: 'clustering',
    weight: 1,
    text: 'What is a limitation of K-Means clustering?',
    options: {
      A: 'It can only work with labeled data.',
      B: 'You need to specify the number of clusters (k) in advance.',
      C: 'It always produces the same result regardless of initialization.',
      D: 'It cannot handle numerical data.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'f19',
    type: 'multiple',
    category: 'clustering',
    weight: 1,
    text: 'Which clustering algorithm can find clusters of arbitrary shapes?',
    options: {
      A: 'K-Means',
      B: 'DBSCAN',
      C: 'Linear Regression',
      D: 'Logistic Regression'
    },
    correctAnswer: 'B'
  },
  {
    id: 'f20',
    type: 'multiple',
    category: 'clustering',
    weight: 1,
    text: 'What does the "elbow method" help determine in K-Means?',
    options: {
      A: 'The best features to use.',
      B: 'The optimal number of clusters.',
      C: 'The learning rate.',
      D: 'The regularization parameter.'
    },
    correctAnswer: 'B'
  },

  // Section 7: Model Evaluation (5 questions)
  {
    id: 'f21',
    type: 'multiple',
    category: 'model_evaluation',
    weight: 1,
    text: 'What does a high precision but low recall indicate?',
    options: {
      A: 'The model predicts many false positives.',
      B: 'The model is conservative - when it predicts positive, it\'s usually correct, but it misses many actual positives.',
      C: 'The model is overfitting.',
      D: 'The model has high accuracy.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'f22',
    type: 'multiple',
    category: 'model_evaluation',
    weight: 1,
    text: 'What is the purpose of a validation set?',
    options: {
      A: 'To train the model.',
      B: 'To tune hyperparameters and prevent overfitting to the test set.',
      C: 'To preprocess the data.',
      D: 'To increase the size of training data.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'f23',
    type: 'multiple',
    category: 'model_evaluation',
    weight: 1,
    text: 'If your training accuracy is 99% but test accuracy is 60%, what is likely happening?',
    options: {
      A: 'Underfitting',
      B: 'Overfitting',
      C: 'The model is well-balanced',
      D: 'Data leakage'
    },
    correctAnswer: 'B'
  },
  {
    id: 'f24',
    type: 'multiple',
    category: 'model_evaluation',
    weight: 1,
    text: 'What does ROC curve plot?',
    options: {
      A: 'Precision vs Recall',
      B: 'True Positive Rate vs False Positive Rate',
      C: 'Training error vs Test error',
      D: 'Bias vs Variance'
    },
    correctAnswer: 'B'
  },
  {
    id: 'f25',
    type: 'multiple',
    category: 'model_evaluation',
    weight: 1,
    text: 'Why is accuracy not always a good metric for imbalanced datasets?',
    options: {
      A: 'Because accuracy is too slow to compute.',
      B: 'Because a model can achieve high accuracy by always predicting the majority class.',
      C: 'Because accuracy only works for regression problems.',
      D: 'Because accuracy requires balanced data to be calculated.'
    },
    correctAnswer: 'B'
  }
];

// ============================================
// SHARED CONSTANTS
// ============================================

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// Test 1: Original ML Assessment categories
const hardSkillCategories = ['probability_stats', 'ml_algorithms', 'data_preparation', 'validation_metrics', 'coding'];
const softSkillCategories = ['soft_communication', 'soft_teamwork', 'soft_selforg', 'soft_feedback', 'soft_creativity', 'soft_documentation'];

// Test 1: Original levels
const levels = [
    { name: 'Below Junior', min: 0, max: 5 },
    { name: 'Junior', min: 6, max: 24 },
    { name: 'Middle', min: 25, max: 54 },
    { name: 'Senior', min: 55, max: 79 },
    { name: 'Senior+', min: 80, max: 99 },
    { name: 'Tech Lead', min: 100, max: 104 },
    { name: 'Head of', min: 105, max: Infinity }
];

// Test 2: ML Fundamentals categories (all hard skills)
const fundamentalsCategories = ['supervised_learning', 'svm_kernels', 'dimensionality_reduction', 'ensemble_methods', 'neural_networks', 'clustering', 'model_evaluation'];

// Test 2: ML Fundamentals levels (25 questions, 1 point each = 25 max)
const fundamentalsLevels = [
    { name: 'Needs Study', min: 0, max: 9 },      // 0-36%
    { name: 'Basic', min: 10, max: 14 },          // 40-56%
    { name: 'Intermediate', min: 15, max: 19 },   // 60-76%
    { name: 'Good', min: 20, max: 22 },           // 80-88%
    { name: 'Excellent', min: 23, max: 25 }       // 92-100%
];

// ============================================
// MAIN WORKER HANDLER
// ============================================

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // ==========================================
    // TEST 1: ORIGINAL ML ASSESSMENT ROUTES
    // ==========================================
    if (path === '/api/questions' && request.method === 'GET') {
      return await getQuestions(env, 'ML_QUESTIONS', DEFAULT_QUESTIONS);
    }
    if (path === '/api/questions' && request.method === 'POST') {
      return await createQuestion(request, env, 'ML_QUESTIONS');
    }
    if (path === '/api/questions/replace' && request.method === 'POST') {
      return await replaceQuestions(request, env, 'ML_QUESTIONS');
    }
    if (path.startsWith('/api/questions/') && !path.includes('/fundamentals/') && request.method === 'PUT') {
      const id = path.split('/').pop();
      return await updateQuestion(request, id, env, 'ML_QUESTIONS');
    }
    if (path.startsWith('/api/questions/') && !path.includes('/fundamentals/') && request.method === 'DELETE') {
      const id = path.split('/').pop();
      return await deleteQuestion(id, env, 'ML_QUESTIONS');
    }
    if (path === '/api/questions/reset' && request.method === 'POST') {
      return await resetQuestions(env, 'ML_QUESTIONS', DEFAULT_QUESTIONS);
    }
    if (path === '/api/results' && request.method === 'POST') {
      return await saveTestResult(request, env, 'ML_QUESTIONS', DEFAULT_QUESTIONS, hardSkillCategories, softSkillCategories, levels);
    }
    if (path.startsWith('/api/results/') && !path.includes('/fundamentals/') && request.method === 'PUT') {
      const id = path.split('/').pop();
      return await updateTestResult(request, id, env, 'ML_QUESTIONS', DEFAULT_QUESTIONS, hardSkillCategories, softSkillCategories, levels);
    }
    if (path === '/api/analytics' && request.method === 'GET') {
      return await getAnalytics(env, 'ML_QUESTIONS', DEFAULT_QUESTIONS, hardSkillCategories, softSkillCategories);
    }
    if (path === '/api/results/replace' && request.method === 'POST') {
      return await replaceResults(request, env, 'ML_QUESTIONS');
    }

    // ==========================================
    // TEST 2: ML FUNDAMENTALS ROUTES
    // ==========================================
    if (path === '/api/fundamentals/questions' && request.method === 'GET') {
      return await getQuestions(env, 'ML_FUNDAMENTALS', DEFAULT_QUESTIONS_FUNDAMENTALS);
    }
    if (path === '/api/fundamentals/questions' && request.method === 'POST') {
      return await createQuestion(request, env, 'ML_FUNDAMENTALS');
    }
    if (path === '/api/fundamentals/questions/replace' && request.method === 'POST') {
      return await replaceQuestions(request, env, 'ML_FUNDAMENTALS');
    }
    if (path.startsWith('/api/fundamentals/questions/') && request.method === 'PUT') {
      const id = path.split('/').pop();
      return await updateQuestion(request, id, env, 'ML_FUNDAMENTALS');
    }
    if (path.startsWith('/api/fundamentals/questions/') && request.method === 'DELETE') {
      const id = path.split('/').pop();
      return await deleteQuestion(id, env, 'ML_FUNDAMENTALS');
    }
    if (path === '/api/fundamentals/questions/reset' && request.method === 'POST') {
      return await resetQuestions(env, 'ML_FUNDAMENTALS', DEFAULT_QUESTIONS_FUNDAMENTALS);
    }
    if (path === '/api/fundamentals/results' && request.method === 'POST') {
      return await saveTestResultFundamentals(request, env);
    }
    if (path.startsWith('/api/fundamentals/results/') && request.method === 'PUT') {
      const id = path.split('/').pop();
      return await updateTestResultFundamentals(request, id, env);
    }
    if (path === '/api/fundamentals/analytics' && request.method === 'GET') {
      return await getAnalyticsFundamentals(env);
    }
    if (path === '/api/fundamentals/results/replace' && request.method === 'POST') {
      return await replaceResults(request, env, 'ML_FUNDAMENTALS');
    }

    // ==========================================
    // LIST AVAILABLE TESTS
    // ==========================================
    if (path === '/api/tests' && request.method === 'GET') {
      return new Response(JSON.stringify({
        success: true,
        tests: [
          {
            id: 'ml_assessment',
            name: 'ML Full Assessment',
            description: 'Comprehensive ML/DS assessment with hard and soft skills',
            endpoint: '/api',
            questionCount: DEFAULT_QUESTIONS.length,
            estimatedTime: '45-60 min'
          },
          {
            id: 'ml_fundamentals',
            name: 'ML Fundamentals',
            description: 'Quick test of core ML/DS concepts for students',
            endpoint: '/api/fundamentals',
            questionCount: DEFAULT_QUESTIONS_FUNDAMENTALS.length,
            estimatedTime: '15 min'
          }
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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

// ============================================
// SHARED FUNCTIONS (parameterized by KV binding)
// ============================================

async function getQuestions(env, kvBinding, defaultQuestions) {
  try {
    const kv = env[kvBinding];
    let questions = await kv.get('questions', { type: 'json' });
    if (!questions) {
      questions = defaultQuestions;
      await kv.put('questions', JSON.stringify(questions));
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

async function createQuestion(request, env, kvBinding) {
  try {
    const kv = env[kvBinding];
    const question = await request.json();
    let questions = await kv.get('questions', { type: 'json' }) || [];
    question.id = crypto.randomUUID();
    questions.push(question);
    await kv.put('questions', JSON.stringify(questions));
    return new Response(JSON.stringify({ success: true, question }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to create question' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function replaceQuestions(request, env, kvBinding) {
  try {
    const kv = env[kvBinding];
    const newQuestions = await request.json();
    if (!Array.isArray(newQuestions)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid data format: Array expected.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    await kv.put('questions', JSON.stringify(newQuestions));
    return new Response(JSON.stringify({ success: true, count: newQuestions.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to replace questions' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function updateQuestion(request, id, env, kvBinding) {
  try {
    const kv = env[kvBinding];
    const questionData = await request.json();
    let questions = await kv.get('questions', { type: 'json' }) || [];
    const index = questions.findIndex(q => q.id === id);
    if (index === -1) {
      return new Response(JSON.stringify({ success: false, error: 'Question not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    questions[index] = { ...questionData, id };
    await kv.put('questions', JSON.stringify(questions));
    return new Response(JSON.stringify({ success: true, question: questions[index] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to update question' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function deleteQuestion(id, env, kvBinding) {
  try {
    const kv = env[kvBinding];
    let questions = await kv.get('questions', { type: 'json' }) || [];
    questions = questions.filter(q => q.id !== id);
    await kv.put('questions', JSON.stringify(questions));
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to delete question' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function resetQuestions(env, kvBinding, defaultQuestions) {
  try {
    const kv = env[kvBinding];
    await kv.put('questions', JSON.stringify(defaultQuestions));
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to reset questions' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function replaceResults(request, env, kvBinding) {
  try {
    const kv = env[kvBinding];
    const newResults = await request.json();
    if (!Array.isArray(newResults)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid data format: Array expected.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    await kv.put('results', JSON.stringify(newResults));
    return new Response(JSON.stringify({ success: true, count: newResults.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to replace results' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// ============================================
// TEST 1: ORIGINAL ML ASSESSMENT FUNCTIONS
// ============================================

async function saveTestResult(request, env, kvBinding, defaultQuestions, hardCats, softCats, levelsList) {
  try {
    const kv = env[kvBinding];
    const result = await request.json();
    result.id = crypto.randomUUID();

    let totalScore = 0;
    let hardSkillScore = 0;
    let softSkillScore = 0;
    let maxHardSkillScore = 0;
    let maxSoftSkillScore = 0;

    const questions = await kv.get('questions', { type: 'json' }) || defaultQuestions;
    const questionMap = new Map(questions.map(q => [q.id, q]));

    (result.detailedAnswers || []).forEach(ans => {
      const question = questionMap.get(ans.questionId);
      if (!question) return;

      let points = 0;
      if (question.type === 'multiple') {
        if (ans.isCorrect) {
          points = question.weight || 0;
        }
      } else {
        points = ans.pointsAwarded || 0;
      }
      
      totalScore += points;
      
      if (hardCats.includes(question.category)) {
        hardSkillScore += points;
      } else if (softCats.includes(question.category)) {
        softSkillScore += points;
      }
    });

    questions.forEach(q => {
      if (hardCats.includes(q.category)) {
        maxHardSkillScore += q.weight || 0;
      } else if (softCats.includes(q.category)) {
        maxSoftSkillScore += q.weight || 0;
      }
    });

    const maxScore = maxHardSkillScore + maxSoftSkillScore;

    result.score = parseFloat(totalScore.toFixed(2));
    result.hardSkillScore = parseFloat(hardSkillScore.toFixed(2));
    result.softSkillScore = parseFloat(softSkillScore.toFixed(2));
    result.maxScore = parseFloat(maxScore.toFixed(2));
    result.maxHardSkillScore = parseFloat(maxHardSkillScore.toFixed(2));
    result.maxSoftSkillScore = parseFloat(maxSoftSkillScore.toFixed(2));
    
    result.percentage = result.maxScore > 0 ? Math.round((result.score / result.maxScore) * 100) : 0;
    result.level = levelsList.find(l => result.score >= l.min && result.score <= l.max)?.name || 'N/A';

    let results = await kv.get('results', { type: 'json' }) || [];
    results.push(result);
    if (results.length > 100) results = results.slice(-100);
    await kv.put('results', JSON.stringify(results));
    
    return new Response(JSON.stringify({ success: true, id: result.id, result: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to save result:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to save result' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function updateTestResult(request, id, env, kvBinding, defaultQuestions, hardCats, softCats, levelsList) {
  try {
    const kv = env[kvBinding];
    const { questionId, pointsAwarded } = await request.json();
    let results = await kv.get('results', { type: 'json' }) || [];
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

    result.detailedAnswers[answerIndex].pointsAwarded = pointsAwarded;

    let newScore = 0;
    let newHardSkillScore = 0;
    let newSoftSkillScore = 0;
    
    const questions = await kv.get('questions', { type: 'json' }) || defaultQuestions;
    const questionMap = new Map(questions.map(q => [q.id, q]));

    result.detailedAnswers.forEach(ans => {
      const question = questionMap.get(ans.questionId);
      if (!question) return;

      let points = 0;
      if (question.type === 'multiple') {
        if (ans.isCorrect) {
          points = question.weight || 0;
        }
      } else {
        points = ans.pointsAwarded || 0;
      }
      
      newScore += points;
      
      if (hardCats.includes(question.category)) {
        newHardSkillScore += points;
      } else if (softCats.includes(question.category)) {
        newSoftSkillScore += points;
      }
    });
    
    let maxHardSkillScore = 0;
    let maxSoftSkillScore = 0;
    questions.forEach(q => {
      if (hardCats.includes(q.category)) {
        maxHardSkillScore += q.weight || 0;
      } else if (softCats.includes(q.category)) {
        maxSoftSkillScore += q.weight || 0;
      }
    });
    const maxScore = maxHardSkillScore + maxSoftSkillScore;

    result.score = parseFloat(newScore.toFixed(2));
    result.hardSkillScore = parseFloat(newHardSkillScore.toFixed(2));
    result.softSkillScore = parseFloat(newSoftSkillScore.toFixed(2));
    result.maxScore = parseFloat(maxScore.toFixed(2));
    result.maxHardSkillScore = parseFloat(maxHardSkillScore.toFixed(2));
    result.maxSoftSkillScore = parseFloat(maxSoftSkillScore.toFixed(2));

    result.percentage = result.maxScore > 0 ? Math.round((result.score / result.maxScore) * 100) : 0;
    result.level = levelsList.find(l => result.score >= l.min && result.score <= l.max)?.name || 'N/A';

    results[resultIndex] = result;
    
    await kv.put('results', JSON.stringify(results));
    
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

async function getAnalytics(env, kvBinding, defaultQuestions, hardCats, softCats) {
  try {
    const kv = env[kvBinding];
    const results = await kv.get('results', { type: 'json' }) || [];
    const questions = await kv.get('questions', { type: 'json' }) || defaultQuestions;
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

// ============================================
// TEST 2: ML FUNDAMENTALS FUNCTIONS
// ============================================

async function saveTestResultFundamentals(request, env) {
  try {
    const kv = env.ML_FUNDAMENTALS;
    const result = await request.json();
    result.id = crypto.randomUUID();

    let totalScore = 0;
    const categoryScores = {};

    const questions = await kv.get('questions', { type: 'json' }) || DEFAULT_QUESTIONS_FUNDAMENTALS;
    const questionMap = new Map(questions.map(q => [q.id, q]));

    // Initialize category scores
    fundamentalsCategories.forEach(cat => {
      categoryScores[cat] = { score: 0, max: 0 };
    });

    // Calculate max scores per category
    questions.forEach(q => {
      if (categoryScores[q.category]) {
        categoryScores[q.category].max += q.weight || 1;
      }
    });

    // Calculate actual scores
    (result.detailedAnswers || []).forEach(ans => {
      const question = questionMap.get(ans.questionId);
      if (!question) return;

      if (ans.isCorrect) {
        const points = question.weight || 1;
        totalScore += points;
        if (categoryScores[question.category]) {
          categoryScores[question.category].score += points;
        }
      }
    });

    const maxScore = questions.reduce((sum, q) => sum + (q.weight || 1), 0);

    result.score = totalScore;
    result.maxScore = maxScore;
    result.categoryScores = categoryScores;
    result.percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    result.level = fundamentalsLevels.find(l => totalScore >= l.min && totalScore <= l.max)?.name || 'N/A';

    let results = await kv.get('results', { type: 'json' }) || [];
    results.push(result);
    if (results.length > 100) results = results.slice(-100);
    await kv.put('results', JSON.stringify(results));
    
    return new Response(JSON.stringify({ success: true, id: result.id, result: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to save fundamentals result:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to save result' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function updateTestResultFundamentals(request, id, env) {
  try {
    const kv = env.ML_FUNDAMENTALS;
    const { questionId, isCorrect } = await request.json();
    let results = await kv.get('results', { type: 'json' }) || [];
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

    result.detailedAnswers[answerIndex].isCorrect = isCorrect;

    // Recalculate scores
    let totalScore = 0;
    const categoryScores = {};
    
    const questions = await kv.get('questions', { type: 'json' }) || DEFAULT_QUESTIONS_FUNDAMENTALS;
    const questionMap = new Map(questions.map(q => [q.id, q]));

    fundamentalsCategories.forEach(cat => {
      categoryScores[cat] = { score: 0, max: 0 };
    });

    questions.forEach(q => {
      if (categoryScores[q.category]) {
        categoryScores[q.category].max += q.weight || 1;
      }
    });

    result.detailedAnswers.forEach(ans => {
      const question = questionMap.get(ans.questionId);
      if (!question) return;

      if (ans.isCorrect) {
        const points = question.weight || 1;
        totalScore += points;
        if (categoryScores[question.category]) {
          categoryScores[question.category].score += points;
        }
      }
    });

    const maxScore = questions.reduce((sum, q) => sum + (q.weight || 1), 0);

    result.score = totalScore;
    result.maxScore = maxScore;
    result.categoryScores = categoryScores;
    result.percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    result.level = fundamentalsLevels.find(l => totalScore >= l.min && totalScore <= l.max)?.name || 'N/A';

    results[resultIndex] = result;
    await kv.put('results', JSON.stringify(results));
    
    return new Response(JSON.stringify({ success: true, result: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to update fundamentals result:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to update result' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function getAnalyticsFundamentals(env) {
  try {
    const kv = env.ML_FUNDAMENTALS;
    const results = await kv.get('results', { type: 'json' }) || [];
    const questions = await kv.get('questions', { type: 'json' }) || DEFAULT_QUESTIONS_FUNDAMENTALS;
    const totalTests = results.length;

    if (totalTests === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        totalTests: 0, 
        averageScore: 0,
        averagePercentage: 0,
        totalQuestions: questions.length, 
        passRate: 0,
        categoryAverages: {},
        levelDistribution: {},
        recentResults: [] 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const averageScore = parseFloat((results.reduce((sum, r) => sum + r.score, 0) / totalTests).toFixed(1));
    const averagePercentage = Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalTests);
    const passRate = Math.round((results.filter(r => r.percentage >= 60).length / totalTests) * 100);

    // Calculate category averages
    const categoryAverages = {};
    fundamentalsCategories.forEach(cat => {
      const catResults = results.filter(r => r.categoryScores && r.categoryScores[cat]);
      if (catResults.length > 0) {
        const avgPercent = catResults.reduce((sum, r) => {
          const catScore = r.categoryScores[cat];
          return sum + (catScore.max > 0 ? (catScore.score / catScore.max) * 100 : 0);
        }, 0) / catResults.length;
        categoryAverages[cat] = Math.round(avgPercent);
      }
    });

    // Level distribution
    const levelDistribution = {};
    fundamentalsLevels.forEach(l => levelDistribution[l.name] = 0);
    results.forEach(r => {
      if (r.level && levelDistribution[r.level] !== undefined) {
        levelDistribution[r.level]++;
      }
    });

    const recentResults = results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
    
    return new Response(JSON.stringify({ 
      success: true, 
      totalTests, 
      averageScore,
      averagePercentage,
      totalQuestions: questions.length, 
      passRate,
      categoryAverages,
      levelDistribution,
      recentResults 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Fundamentals Analytics Error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to get analytics' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}



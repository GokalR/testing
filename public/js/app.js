

// Default questions dataset
const DEFAULT_QUESTIONS = [
  // Hard Skills (50 points total)
  // Блок 1: Вероятность и Статистика (10 вопросов, 10 баллов)
  {
    id: 'h1',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'Что такое p-value?',
    options: {
      A: 'Вероятность того, что нулевая гипотеза верна.',
      B: 'Вероятность получения наблюдаемых (или более экстремальных) результатов, при условии, что нулевая гипотеза верна.',
      C: 'Мощность статистического теста.',
      D: 'Размер выборки, необходимый для проведения теста.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h2',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'В контексте мониторинга банковского мошенничества, что такое Ошибка II рода?',
    options: {
      A: 'Система помечает легитимную транзакцию как мошенническую.',
      B: 'Система пропускает мошенническую транзакцию, считая её легитимной.',
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
    text: 'Какое статистическое распределение чаще всего используется для моделирования количества дефолтов по кредитам в портфеле за определённый период?',
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
    weight: 1,
    text: 'Что из перечисленного НЕ является обязательным условием для применения классической линейной регрессии?',
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
    weight: 1,
    text: 'Зачем необходимо проводить A/B тестирование при внедрении новой скоринговой модели?',
    options: {
      A: 'Чтобы проверить, что код модели написан корректно.',
      B: 'Чтобы измерить реальное влияние новой модели на бизнес-метрики (например, уровень одобрения и уровень дефолтности) по сравнению со старой.',
      C: 'Чтобы определить, какая модель работает быстрее.',
      D: 'Чтобы собрать больше данных для обучения.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h6',
    type: 'multiple',
    category: 'probability_stats',
    weight: 2,
    text: 'Что такое Центральная Предельная Теорема?',
    options: {
      A: 'Теорема о том, что любая случайная величина имеет нормальное распределение.',
      B: 'Теорема о том, что дисперсия выборки всегда меньше дисперсии генеральной совокупности.',
      C: 'Теорема о том, что распределение выборочных средних стремится к нормальному по мере увеличения размера выборки, независимо от исходного распределения.',
      D: 'Теорема о том, что p-value всегда должно быть меньше 0.05.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h7',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'Вам нужно сравнить средний чек по кредитным картам для двух групп клиентов. Какой статистический тест наиболее подходит для этой задачи?',
    options: {
      A: 'Критерий хи-квадрат.',
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
      A: 'Диапазон, в котором, как мы полагаем, находится истинное значение параметра генеральной совокупности с определённым уровнем уверенности.',
      B: 'Диапазон, в который попадают все значения выборки.',
      C: 'Интервал, в котором p-value считается значимым.',
      D: 'Интервал времени, в течение которого собирались данные.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h9',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'Как проблема множественных сравнений влияет на интерпретацию p-value при проведении десятков A/B тестов одновременно?',
    options: {
      A: 'Никак не влияет.',
      B: 'Уменьшает вероятность совершения ошибки I рода.',
      C: 'Увеличивает вероятность случайно получить статистически значимый результат (ошибка I рода), поэтому требуется поправка (например, Бонферрони).',
      D: 'Требует увеличения размера выборки для каждого теста.'
    },
    correctAnswer: 'C'
  },
  // Блок 2: Классические алгоритмы ML (10 вопросов, 10 баллов)
  {
    id: 'h11',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Какой из перечисленных алгоритмов является методом кластеризации?',
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
    text: 'В чем основная идея алгоритма градиентного бустинга?',
    options: {
      A: 'Он строит множество независимых деревьев, а затем усредняет их предсказания.',
      B: 'Он последовательно строит деревья, где каждое последующее пытается исправить ошибки предыдущего.',
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
      A: 'Предсказание оттока клиентов (да/нет).',
      B: 'Определение вероятности дефолта по кредиту.',
      C: 'Прогнозирование суммы следующей транзакции клиента.',
      D: 'Скоринг кредитных заявок (одобрить/отклонить).'
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
    text: 'Что такое компромисс между смещением и дисперсией (bias-variance trade-off)?',
    options: {
      A: 'Компромисс между скоростью обучения и точностью модели.',
      B: 'Компромисс между ошибкой на обучающей выборке (смещение) и ошибкой на тестовой выборке (дисперсия).',
      C: 'Компромисс между простотой модели (высокое смещение, низкая дисперсия) и её сложностью (низкое смещение, высокая дисперсия).',
      D: 'Компромисс между количеством признаков и количеством наблюдений.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h17',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Какова основная цель L1-регуляризации (Lasso)?',
    options: {
      A: 'Уменьшить сложность модели путем обнуления весов наименее важных признаков, тем самым производя отбор признаков.',
      B: 'Увеличить точность модели путем добавления новых признаков.',
      C: 'Ускорить процесс обучения модели.',
      D: 'Только уменьшить величину весов признаков, не обнуляя их.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h18',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Какой алгоритм лежит в основе популярной библиотеки CatBoost, делая её особенно эффективной для работы с категориальными признаками?',
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
    text: 'Какой метод используется для снижения размерности данных?',
    options: {
      A: 'K-Means.',
      B: 'Метод главных компонент (PCA).',
      C: 'Логистическая регрессия.',
      D: 'Градиентный бустинг.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h21',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'В чем основное преимущество ансамблевых моделей по сравнению с одним решающим деревом?',
    options: {
      A: 'Они всегда работают быстрее.',
      B: 'Они более устойчивы к переобучению и в целом обладают более высокой обобщающей способностью.',
      C: 'Они проще для интерпретации.',
      D: 'Они требуют меньше данных для обучения.'
    },
    correctAnswer: 'B'
  },
  // Блок 3: Подготовка данных и Feature Engineering (5 вопросов, 5 баллов)
  {
    id: 'h23',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'Что такое One-Hot Encoding?',
    options: {
      A: 'Метод для заполнения пропущенных значений.',
      B: 'Метод преобразования категориального признака в набор бинарных признаков (0/1).',
      C: 'Метод для масштабирования числовых признаков.',
      D: 'Метод для снижения размерности.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h24',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'Зачем нужна стандартизация числовых признаков?',
    options: {
      A: 'Чтобы привести все значения к диапазону от 0 до 1.',
      B: 'Чтобы преобразовать распределение признака к нормальному.',
      C: 'Чтобы привести признаки к общему масштабу (среднее = 0, ст.отклонение = 1), что необходимо для многих алгоритмов (SVM, линейные модели).',
      D: 'Чтобы удалить выбросы из данных.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h25',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'Что из перечисленного является примером "утечки данных" (data leakage)?',
    options: {
      A: 'Использование информации о дефолте клиента для предсказания вероятности этого же самого дефолта.',
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
    text: 'Как бороться с несбалансированными данными в задачах классификации?',
    options: {
      A: 'Игнорировать это.',
      B: 'Использовать SMOTE или undersampling.',
      C: 'Всегда использовать метрику accuracy.',
      D: 'Удалить миноритарный класс.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h31',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'Какова цель разделения данных на обучающую и тестовую выборки?',
    options: {
      A: 'Чтобы переобучить модель.',
      B: 'Чтобы оценить модель на данных, которые она не видела.',
      C: 'Чтобы уменьшить размер набора данных.',
      D: 'Чтобы увеличить количество признаков.'
    },
    correctAnswer: 'B'
  },
  // Блок 4: Валидация и Метрики (5 вопросов, 5 баллов)
  {
    id: 'h33',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 1,
    text: 'Что такое метрика Accuracy?',
    options: {
      A: '(TP + TN) / общее количество',
      B: 'TP / (TP + FP)',
      C: 'TP / (TP + FN)',
      D: '2 * precision * recall / (precision + recall)'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h34',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 1,
    text: 'Когда F1-мера предпочтительнее Accuracy?',
    options: {
      A: 'При сбалансированных данных.',
      B: 'При несбалансированных данных.',
      C: 'В задачах регрессии.',
      D: 'В обучении без учителя.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h35',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 1,
    text: 'Что представляет собой AUC-ROC?',
    options: {
      A: 'Площадь под кривой точности-полноты (precision-recall curve).',
      B: 'Площадь под кривой рабочих характеристик приёмника (receiver operating characteristic curve).',
      C: 'Средняя абсолютная ошибка.',
      D: 'Коэффициент детерминации R-квадрат.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h36',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 1,
    text: 'Что такое k-блочная кросс-валидация (k-fold cross-validation)?',
    options: {
      A: 'Однократное разделение данных на обучающую и тестовую выборки.',
      B: 'Разделение данных на k подмножеств и обучение модели k раз.',
      C: 'Техника для переобучения модели.',
      D: 'Метод аугментации данных.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h37',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 1,
    text: 'Что такое матрица ошибок (confusion matrix)?',
    options: {
      A: 'Таблица для оценки качества работы классификатора.',
      B: 'График ошибок модели.',
      C: 'Метрика для задач регрессии.',
      D: 'Метод отбора признаков.'
    },
    correctAnswer: 'A'
  },
  // Блок 5: Кодинг (5 вопросов, 20 баллов)
  {
    id: 'h38',
    type: 'code',
    category: 'coding',
    weight: 4,
    text: 'Напишите функцию на Python для вычисления среднеквадратичной ошибки (MSE).',
    test_cases: 'def mse(y_true, y_pred):\n    # Ваша реализация\n\nПример: mse([1,2,3], [1.1,1.9,3.0]) ≈ 0.0067'
  },
  {
    id: 'h39',
    type: 'code',
    category: 'coding',
    weight: 4,
    text: 'Реализуйте линейную регрессию с нуля на Python.',
    test_cases: 'Используйте numpy для вычислений. Реализуйте методы fit и predict.'
  },
  {
    id: 'h40',
    type: 'code',
    category: 'coding',
    weight: 4,
    text: 'Напишите код для разделения данных на обучающую и тестовую выборки.',
    test_cases: 'def train_test_split(X, y, test_size=0.2, random_state=42):\n    # Ваша реализация без использования sklearn'
  },
  {
    id: 'h41',
    type: 'code',
    category: 'coding',
    weight: 4,
    text: 'Реализуйте алгоритм кластеризации k-means.',
    test_cases: 'Базовая версия с евклидовым расстоянием.'
  },
  {
    id: 'h42',
    type: 'code',
    category: 'coding',
    weight: 4,
    text: 'Напишите функцию для нормализации данных с использованием min-max масштабирования.',
    test_cases: 'def min_max_normalize(data):\n    # Ваша реализация'
  },
  // Soft Skills (55 points total)
  // Блок 6: Коммуникация (6 вопросов, 18 баллов)
  {
    id: 's1',
    type: 'multiple',
    category: 'soft_communication',
    weight: 3,
    text: 'Как бы вы объяснили сложную ML-модель нетехническому стейкхолдеру?',
    options: {
      A: 'Использовать технический жаргон, чтобы показать свою экспертизу.',
      B: 'Использовать простые аналогии, визуализации и фокусироваться на бизнес-результате.',
      C: 'Избегать деталей и сказать, что "это просто работает".',
      D: 'Показать код модели.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's2',
    type: 'open',
    category: 'soft_communication',
    weight: 3,
    text: 'Приведите пример, когда вам нужно было объяснить сложный технический аспект проекта (например, выбор метрики или архитектуры модели) нетехническому менеджеру. Как вы построили свое объяснение и как убедились, что вас поняли правильно?'
  },
  {
    id: 's3',
    type: 'multiple',
    category: 'soft_communication',
    weight: 3,
    text: 'Как лучше всего обрабатывать вопросы во время презентации?',
    options: {
      A: 'Игнорировать их до конца выступления.',
      B: 'Отвечать четко и лаконично, убедившись, что ответ понятен.',
      C: 'Сменить тему, если вопрос сложный.',
      D: 'Занимать оборонительную позицию.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's4',
    type: 'multiple',
    category: 'soft_communication',
    weight: 3,
    text: 'Как вы убеждаетесь, что ваше сообщение понято правильно?',
    options: {
      A: 'Предполагаю, что если молчат, значит всё поняли.',
      B: 'Задаю уточняющие вопросы и прошу дать обратную связь.',
      C: 'Повторяю одно и то же несколько раз.',
      D: 'Использую сложные термины, чтобы выглядеть умнее.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's5',
    type: 'open',
    category: 'soft_communication',
    weight: 3,
    text: 'Вам нужно обсудить результаты эксперимента с двумя группами: командой Data Scientists и отделом маркетинга. Какие ключевые различия будут в вашем подходе к коммуникации с каждой из этих групп?'
  },
  {
    id: 's6',
    type: 'multiple',
    category: 'soft_communication',
    weight: 3,
    text: 'Что такое активное слушание?',
    options: {
      A: 'Ожидание своей очереди, чтобы высказаться.',
      B: 'Полная концентрация на собеседнике, понимание, реакция и запоминание.',
      C: 'Выполнение нескольких дел одновременно во время разговора.',
      D: 'Перебивание собеседника для уточнений.'
    },
    correctAnswer: 'B'
  },
  // Блок 7: Работа в команде (5 вопросов, 16 баллов)
  {
    id: 's7',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 3,
    text: 'Как вы справляетесь с конфликтами в команде?',
    options: {
      A: 'Избегаю их любой ценой.',
      B: 'Обсуждаю проблему открыто и ищу компромисс.',
      C: 'Принимаю чью-то сторону.',
      D: 'Игнорирую проблему, надеясь, что она решится сама.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's8',
    type: 'open',
    category: 'soft_teamwork',
    weight: 3,
    text: 'Опишите самый сложный командный проект, в котором вы участвовали. В чем заключалась основная сложность (техническая, организационная, межличностная) и каков был ваш личный вклад в её преодоление?'
  },
  {
    id: 's9',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 3,
    text: 'Что важно для эффективной командной работы?',
    options: {
      A: 'Индивидуальный успех.',
      B: 'Доверие и открытая коммуникация.',
      C: 'Конкуренция внутри команды.',
      D: 'Изоляция и работа в одиночку.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's10',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 3,
    text: 'Как вы вносите вклад в достижение командных целей?',
    options: {
      A: 'Фокусируюсь только на своих задачах.',
      B: 'Делюсь знаниями и поддерживаю других.',
      C: 'Делегирую всю сложную работу.',
      D: 'Критикую идеи других.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's11',
    type: 'open',
    category: 'soft_teamwork',
    weight: 4,
    text: 'Вы заметили, что коллега в вашей команде систематически не успевает выполнять свои задачи, что тормозит общий прогресс. Ваши первые шаги?'
  },
  // Блок 8: Самоорганизация (3 вопроса, 5 баллов)
  {
    id: 's19',
    type: 'open',
    category: 'soft_selforg',
    weight: 2,
    text: 'Вам поручили задачу "исследовать возможность использования AI для улучшения клиентского опыта". Требования очень общие. Опишите по шагам, как вы будете декомпозировать эту задачу и какие артефакты (документы, встречи) создадите на первых этапах для её прояснения.'
  },
  {
    id: 's20',
    type: 'multiple',
    category: 'soft_selforg',
    weight: 1,
    text: 'У вас есть свобода в выборе инструментов для проекта. Чем вы будете руководствоваться?',
    options: {
      A: 'Выберу самые новые и модные технологии, чтобы пополнить резюме.',
      B: 'Выберу самые надежные и проверенные инструменты, даже если они не самые новые.',
      C: 'Проанализирую и выберу инструмент, который лучше всего подходит под конкретную задачу, учитывая его плюсы и минусы.',
      D: 'Выберу инструмент, который лучше всего знают мои коллеги, чтобы мне могли помочь.'
    },
    correctAnswer: 'C'
  },
  {
    id: 's21',
    type: 'multiple',
    category: 'soft_selforg',
    weight: 2,
    text: 'Вы поняли, что ваша текущая работа над проектом зашла в тупик.',
    options: {
      A: 'Продолжу пробовать тот же подход, надеясь на другой результат.',
      B: 'Сделаю шаг назад, чтобы переосмыслить проблему в целом, и, возможно, вернусь к этапу постановки задачи.',
      C: 'Попрошу у менеджера другую задачу.',
      D: 'Скрою проблему и сделаю вид, что всё идёт по плану.'
    },
    correctAnswer: 'B'
  },
  // Блок 9: Обратная связь (3 вопроса, 5 баллов)
  {
    id: 's22',
    type: 'multiple',
    category: 'soft_feedback',
    weight: 2,
    text: 'Вы видите ошибку в презентации руководителя перед важной встречей.',
    options: {
      A: 'Ничего не скажу, чтобы не ставить его в неловкое положение.',
      B: 'Тактично сообщу ему об ошибке один на один до начала встречи.',
      C: 'Укажу на ошибку публично во время его выступления.',
      D: 'Расскажу об ошибке коллегам после совещания.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's23',
    type: 'multiple',
    category: 'soft_feedback',
    weight: 1,
    text: 'Вам кажется, что руководитель ставит вам нереалистичные сроки.',
    options: {
      A: 'Молча соглашусь и буду работать по ночам, рискуя выгореть.',
      B: 'Подготовлю аргументированную оценку сроков, разобью задачу на этапы и предложу руководителю реалистичный план.',
      C: 'Скажу, что это невозможно, и откажусь от задачи.',
      D: 'Пообещаю успеть, но заранее буду знать, что сорву дедлайн.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's24',
    type: 'multiple',
    category: 'soft_feedback',
    weight: 2,
    text: 'Вашу модель раскритиковали на техническом комитете.',
    options: {
      A: 'Приму всю критику на свой счёт и демотивируюсь.',
      B: 'Отделю критику модели от критики себя как личности, соберу все замечания и составлю план по их устранению.',
      C: 'Начну спорить и доказывать, что критики не разбираются в теме.',
      D: 'Решу, что ML — это не моё, и начну учить что-то другое.'
    },
    correctAnswer: 'B'
  },
  // Блок 10: Креативность (3 вопроса, 6 баллов)
  {
    id: 's25',
    type: 'open',
    category: 'soft_creativity',
    weight: 3,
    text: 'Перед вами стоит задача, для которой нет очевидного решения в стандартных библиотеках ML. Например, предсказать популярность нового, еще не выпущенного продукта. Какой исследовательский подход вы бы применили? Опишите ваш план действий.'
  },
  {
    id: 's26',
    type: 'multiple',
    category: 'soft_creativity',
    weight: 2,
    text: 'Менеджер предлагает идею, которая кажется вам технически слабой.',
    options: {
      A: 'Сразу скажу, что идея плохая и работать не будет.',
      B: 'Скажу: "Интересная идея. Давайте я проведу небольшое исследование и сделаю прототип, чтобы мы могли оценить её жизнеспособность на практике".',
      C: 'Формально соглашусь, но делать ничего не буду.',
      D: 'Предложу свою, "правильную" идею вместо его.'
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
      A: 'Это хорошо, так как это стандарт, и всё работает предсказуемо.',
      B: 'Предложу провести R&D день, чтобы изучить и попробовать новые методы, которые могут повысить нашу эффективность.',
      C: 'Буду втайне пробовать новые методы в своих проектах.',
      D: 'Считаю, что если что-то работает, не нужно это менять.'
    },
    correctAnswer: 'B'
  },
  // Блок 11: Документация (2 вопроса, 5 баллов)
  {
    id: 's28',
    type: 'multiple',
    category: 'soft_documentation',
    weight: 2,
    text: 'Проект завершён, модель работает. Осталось написать документацию.',
    options: {
      A: 'Считаю это наименее приоритетной задачей и отложу её на неопределённый срок.',
      B: 'Считаю документацию неотъемлемой частью проекта и выделю на неё время.',
      C: 'Попрошу джуниора написать документацию на мой код.',
      D: 'Напишу самый необходимый минимум, чтобы формально закрыть задачу.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's29',
    type: 'multiple',
    category: 'soft_documentation',
    weight: 3,
    text: 'Вам нужно передать свой проект коллеге.',
    options: {
      A: 'Просто дам ему ссылку на Git-репозиторий.',
      B: 'Организую встречу, где подробно расскажу о проекте, покажу ключевые части кода и оставлю ссылку на подробную документацию.',
      C: 'Запишу для него короткое видео с обзором проекта.',
      D: 'Буду доступен для вопросов, когда он сам начнёт разбираться.'
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



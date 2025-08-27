// Cloudflare Worker for ML Testing Platform Backend

// Default questions dataset
const DEFAULT_QUESTIONS = [
  // Hard Skills (50 points total)
  // Block 1: Probability and Statistics (10 questions, 15 points)
  {
    id: 'h1',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'What is p-value?',
    options: {
      A: 'Probability that the null hypothesis is true.',
      B: 'Probability of obtaining the observed (or more extreme) results, assuming the null hypothesis is true.',
      C: 'Power of the statistical test.',
      D: 'Sample size required for the test.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h2',
    type: 'multiple',
    category: 'probability_stats',
    weight: 2,
    text: 'In the context of banking fraud monitoring, what is a Type II Error?',
    options: {
      A: 'The system marks a legitimate transaction as fraudulent.',
      B: 'The system misses a fraudulent transaction, considering it legitimate.',
      C: 'The client makes an error in data entry.',
      D: 'The model cannot process the transaction due to a technical failure.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h3',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'Which statistical distribution is most often used for modeling the number of credit defaults in a portfolio over a certain period?',
    options: {
      A: 'Normal distribution.',
      B: 'Poisson distribution.',
      C: 'Uniform distribution.',
      D: 'Exponential distribution.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h4',
    type: 'multiple',
    category: 'probability_stats',
    weight: 2,
    text: 'Which of the following is NOT a prerequisite for applying classical linear regression?',
    options: {
      A: 'Linear dependence between predictors and the target variable.',
      B: 'Absence of multicollinearity between predictors.',
      C: 'Normal distribution of all predictors.',
      D: 'Homoscedasticity (constant variance) of residuals.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h5',
    type: 'multiple',
    category: 'probability_stats',
    weight: 2,
    text: 'Why is it necessary to conduct A/B testing when implementing a new scoring model?',
    options: {
      A: 'To check if the model code is correctly written.',
      B: 'To measure the real impact of the new model on business metrics (e.g., approval rate and default level) compared to the old one.',
      C: 'To determine which model works faster.',
      D: 'To collect more data for training.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h6',
    type: 'multiple',
    category: 'probability_stats',
    weight: 3,
    text: 'What is the Central Limit Theorem?',
    options: {
      A: 'Theorem stating that any random variable has a normal distribution.',
      B: 'Theorem that the variance of the sample is always less than the variance of the population.',
      C: 'Theorem that the distribution of sample means tends to normal as the sample size increases, regardless of the original distribution.',
      D: 'Theorem that p-value should always be less than 0.05.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h7',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'You need to compare the average check on credit cards for two groups of clients. Which statistical test is most suitable for this task?',
    options: {
      A: 'Chi-square test.',
      B: 'T-test for independent samples.',
      C: 'Pearson correlation analysis.',
      D: 'Analysis of variance (ANOVA).'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h8',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'What is a confidence interval?',
    options: {
      A: 'Range in which we believe the true value of the population parameter lies with a certain level of confidence.',
      B: 'Range into which all sample values fall.',
      C: 'Interval in which p-value is considered significant.',
      D: 'Time interval during which data was collected.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h9',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'How does the multiple comparisons problem affect the interpretation of p-value when conducting dozens of A/B tests simultaneously?',
    options: {
      A: 'Does not affect it.',
      B: 'Decreases the probability of making a Type I error.',
      C: 'Increases the probability of randomly obtaining a statistically significant result (Type I error), so correction (e.g., Bonferroni) is required.',
      D: 'Requires increasing the sample size for each test.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h10',
    type: 'multiple',
    category: 'probability_stats',
    weight: 1,
    text: 'What is the coefficient of determination (R-squared) in regression analysis?',
    options: {
      A: 'Measure of correlation between two variables.',
      B: 'Proportion of the variance in the dependent variable explained by the model.',
      C: 'Average model error.',
      D: 'Number of features in the model.'
    },
    correctAnswer: 'B'
  },
  // Block 2: Classical ML Algorithms (12 questions, 15 points)
  {
    id: 'h11',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Which of the listed algorithms is a clustering method?',
    options: {
      A: 'Logistic regression.',
      B: 'Decision tree.',
      C: 'K-Means.',
      D: 'Principal component analysis (PCA).'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h12',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'What is the main idea of the gradient boosting algorithm?',
    options: {
      A: 'It builds many independent trees and then averages their predictions.',
      B: 'It sequentially builds trees, where each subsequent tree tries to correct the errors of the previous one.',
      C: 'It finds a hyperplane separating classes with maximum margin.',
      D: 'It groups data based on their similarity in feature space.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h13',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'For which task is logistic regression NOT suitable?',
    options: {
      A: 'Predicting customer churn (yes/no).',
      B: 'Determining the probability of default on a loan.',
      C: 'Predicting the amount of the next client transaction.',
      D: 'Scoring credit applications (approve/reject).'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h14',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'What is the "curse of dimensionality"?',
    options: {
      A: 'Problem where the model becomes too complex for interpretation.',
      B: 'Problem of model overfitting due to a large number of features.',
      C: 'Phenomenon where data becomes very sparse in high-dimensional space, complicating many algorithms.',
      D: 'Error occurring when using too many trees in a random forest.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h15',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Which of the algorithms is most sensitive to the scale of features?',
    options: {
      A: 'Decision tree.',
      B: 'Random forest.',
      C: 'Support vector machine (SVM).',
      D: 'Naive Bayes classifier.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h16',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 2,
    text: 'What is the bias-variance trade-off?',
    options: {
      A: 'Trade-off between training speed and model accuracy.',
      B: 'Trade-off between error on training sample (bias) and error on test sample (variance).',
      C: 'Trade-off between model simplicity (high bias, low variance) and complexity (low bias, high variance).',
      D: 'Trade-off between number of features and number of observations.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h17',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 2,
    text: 'What is the main purpose of L1-regularization (Lasso)?',
    options: {
      A: 'Reduce model complexity by zeroing weights of least important features, thus performing feature selection.',
      B: 'Increase model accuracy by adding new features.',
      C: 'Speed up the model training process.',
      D: 'Only reduce the magnitude of feature weights without zeroing them.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h18',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 2,
    text: 'What algorithm underlies the popular CatBoost library, making it especially effective for working with categorical features?',
    options: {
      A: 'Using One-Hot Encoding for all categorical features.',
      B: 'Using Target Encoding with measures to combat overfitting (e.g., ordered target statistics).',
      C: 'Ignoring all categorical features.',
      D: 'Converting categories to random numbers.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h19',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Which method is used for dimensionality reduction of data?',
    options: {
      A: 'K-Means.',
      B: 'Principal component analysis (PCA).',
      C: 'Logistic regression.',
      D: 'Gradient boosting.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h20',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'For the task of predicting a client\'s account balance for the next month, which type of model is most suitable?',
    options: {
      A: 'Classification model.',
      B: 'Time series model (e.g., ARIMA, LSTM).',
      C: 'Clustering model.',
      D: 'Anomaly detection model.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h21',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'What is the main advantage of ensemble models compared to a single decision tree?',
    options: {
      A: 'They always work faster.',
      B: 'They are more resistant to overfitting and generally have higher generalization ability.',
      C: 'They are simpler to interpret.',
      D: 'They require less data for training.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h22',
    type: 'multiple',
    category: 'ml_algorithms',
    weight: 1,
    text: 'Explain the principle of the K-Nearest Neighbors algorithm.',
    options: {
      A: 'It assigns an object to the class to which the majority of its k nearest neighbors belong.',
      B: 'It divides the data into k clusters.',
      C: 'It builds k independent trees.',
      D: 'It finds k principal components.'
    },
    correctAnswer: 'A'
  },
  // Block 3: Data Preparation & Feature Engineering (10 questions, 10 points)
  {
    id: 'h23',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'What is One-Hot Encoding?',
    options: {
      A: 'Method for filling missing values.',
      B: 'Method for converting a categorical feature into a set of binary features (0/1).',
      C: 'Method for scaling numerical features.',
      D: 'Method for dimensionality reduction.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h24',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'Why is standardization of numerical features needed?',
    options: {
      A: 'To bring all values to the range from 0 to 1.',
      B: 'To transform the feature distribution to normal.',
      C: 'To bring features to a common scale (mean = 0, std = 1), which is necessary for many algorithms (SVM, linear models).',
      D: 'To remove outliers from data.'
    },
    correctAnswer: 'C'
  },
  {
    id: 'h25',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'Which of the following is an example of "data leakage"?',
    options: {
      A: 'Using information about a client\'s default to predict the probability of that same default.',
      B: 'Presence of missing values in data.',
      C: 'Strong correlation between two features.',
      D: 'Unbalanced classes in data.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h26',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'How to handle imbalanced data in classification?',
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
    text: 'What is label encoding?',
    options: {
      A: 'Converting categories to numbers.',
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
    text: 'Why is feature selection needed?',
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
      A: 'Scaling features to [0,1] range.',
      B: 'Scaling to mean 0 and std 1.',
      C: 'Log transformation.',
      D: 'Box-Cox transformation.'
    },
    correctAnswer: 'A'
  },
  {
    id: 'h30',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'What are methods to handle missing data?',
    options: {
      A: 'Delete rows with missing values.',
      B: 'Impute with mean/median/mode.',
      C: 'Use algorithms that handle missing values.',
      D: 'All of the above.'
    },
    correctAnswer: 'D'
  },
  {
    id: 'h31',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'What is the purpose of train-test split?',
    options: {
      A: 'To overfit the model.',
      B: 'To evaluate the model on unseen data.',
      C: 'To reduce the dataset size.',
      D: 'To increase the number of features.'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h32',
    type: 'multiple',
    category: 'data_preparation',
    weight: 1,
    text: 'How to handle outliers in data?',
    options: {
      A: 'Ignore them.',
      B: 'Remove or cap them.',
      C: 'Add more outliers.',
      D: 'Multiply the values.'
    },
    correctAnswer: 'B'
  },
  // Block 4: Validation & Metrics (5 questions, 5 points)
  {
    id: 'h33',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 1,
    text: 'What is accuracy metric?',
    options: {
      A: '(TP + TN) / total',
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
    text: 'When is F1 score preferred over accuracy?',
    options: {
      A: 'Balanced dataset',
      B: 'Imbalanced dataset',
      C: 'Regression tasks',
      D: 'Unsupervised learning'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h35',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 1,
    text: 'What does AUC-ROC represent?',
    options: {
      A: 'Area under precision-recall curve',
      B: 'Area under receiver operating characteristic curve',
      C: 'Mean absolute error',
      D: 'R-squared'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h36',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 1,
    text: 'What is k-fold cross-validation?',
    options: {
      A: 'Splitting data into train and test once',
      B: 'Dividing data into k subsets and training k times',
      C: 'Overfitting technique',
      D: 'Data augmentation'
    },
    correctAnswer: 'B'
  },
  {
    id: 'h37',
    type: 'multiple',
    category: 'validation_metrics',
    weight: 1,
    text: 'What is a confusion matrix?',
    options: {
      A: 'Table to evaluate classification performance',
      B: 'Plot of errors',
      C: 'Metric for regression',
      D: 'Feature selection method'
    },
    correctAnswer: 'A'
  },
  // Block 5: Coding (5 questions, 5 points)
  {
    id: 'h38',
    type: 'code',
    category: 'coding',
    weight: 1,
    text: 'Write a Python function to compute mean squared error.',
    test_cases: 'def mse(y_true, y_pred):\n    return sum((a - b)**2 for a, b in zip(y_true, y_pred)) / len(y_true)\n\nExample: mse([1,2,3], [1.1,1.9,3.0]) ≈ 0.0067'
  },
  {
    id: 'h39',
    type: 'code',
    category: 'coding',
    weight: 1,
    text: 'Implement linear regression from scratch in Python.',
    test_cases: 'Use numpy for calculations.'
  },
  {
    id: 'h40',
    type: 'code',
    category: 'coding',
    weight: 1,
    text: 'Write code to split data into train and test sets.',
    test_cases: 'def train_test_split(X, y, test_size=0.2):\n    # implementation'
  },
  {
    id: 'h41',
    type: 'code',
    category: 'coding',
    weight: 1,
    text: 'Implement k-means clustering algorithm.',
    test_cases: 'Basic version with Euclidean distance.'
  },
  {
    id: 'h42',
    type: 'code',
    category: 'coding',
    weight: 1,
    text: 'Write a function to normalize data using min-max scaling.',
    test_cases: 'def min_max_normalize(data):\n    # implementation'
  },
  // Soft Skills (55 points total)
  // Block 5: Communication (6 questions, 18 points)
  {
    id: 's1',
    type: 'multiple',
    category: 'soft_communication',
    weight: 3,
    text: 'How would you explain a complex ML model to a non-technical stakeholder?',
    options: {
      A: 'Use technical jargon.',
      B: 'Use simple analogies and visuals.',
      C: 'Avoid details.',
      D: 'Show the code.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's2',
    type: 'open',
    category: 'soft_communication',
    weight: 3,
    text: 'Describe a time when you had to present technical findings to a business team.'
  },
  {
    id: 's3',
    type: 'multiple',
    category: 'soft_communication',
    weight: 3,
    text: 'What is the best way to handle questions during a presentation?',
    options: {
      A: 'Ignore them.',
      B: 'Answer clearly and concisely.',
      C: 'Change the topic.',
      D: 'Get defensive.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's4',
    type: 'multiple',
    category: 'soft_communication',
    weight: 3,
    text: 'How do you ensure your message is understood?',
    options: {
      A: 'Assume it is.',
      B: 'Ask for feedback.',
      C: 'Repeat multiple times.',
      D: 'Use complex terms.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's5',
    type: 'open',
    category: 'soft_communication',
    weight: 3,
    text: 'How do you adapt your communication style to different audiences?'
  },
  {
    id: 's6',
    type: 'multiple',
    category: 'soft_communication',
    weight: 3,
    text: 'What is active listening?',
    options: {
      A: 'Waiting for your turn to speak.',
      B: 'Fully concentrating, understanding, responding.',
      C: 'Multitasking while listening.',
      D: 'Interrupting to clarify.'
    },
    correctAnswer: 'B'
  },
  // Block 6: Teamwork (5 questions, 16 points)
  {
    id: 's7',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 3,
    text: 'How do you handle conflicts in a team?',
    options: {
      A: 'Avoid them.',
      B: 'Discuss openly and find compromise.',
      C: 'Take sides.',
      D: 'Ignore the issue.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's8',
    type: 'open',
    category: 'soft_teamwork',
    weight: 3,
    text: 'Describe a time when you collaborated on a project.'
  },
  {
    id: 's9',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 3,
    text: 'What is important for effective teamwork?',
    options: {
      A: 'Individual success.',
      B: 'Trust and communication.',
      C: 'Competition.',
      D: 'Isolation.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's10',
    type: 'multiple',
    category: 'soft_teamwork',
    weight: 3,
    text: 'How do you contribute to team goals?',
    options: {
      A: 'Focus on personal tasks only.',
      B: 'Share knowledge and support others.',
      C: 'Delegate all work.',
      D: 'Criticize others.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's11',
    type: 'open',
    category: 'soft_teamwork',
    weight: 4,
    text: 'How do you deal with a non-performing team member?'
  },
  // Block 7: Self-Organization (3 questions, 5 points)
  {
    id: 's19',
    type: 'open',
    category: 'soft_selforg',
    weight: 2,
    text: 'Situation: You receive a task with very vague requirements.'
  },
  {
    id: 's20',
    type: 'multiple',
    category: 'soft_selforg',
    weight: 1,
    text: 'You have freedom in choosing tools for the project.',
    options: {
      A: 'I will choose the newest and trendiest technologies to boost my resume.',
      B: 'I will choose the most reliable and proven tools, even if they are not the newest.',
      C: 'I will analyze and choose the tool that best fits the specific task, considering its pros and cons.',
      D: 'I will choose the tool that my colleagues know best, so they can support me easier.'
    },
    correctAnswer: 'C'
  },
  {
    id: 's21',
    type: 'multiple',
    category: 'soft_selforg',
    weight: 2,
    text: 'You realize that your current work on the project has reached a dead end.',
    options: {
      A: 'I will continue trying the same approach, hoping for a different result.',
      B: 'I will take a step back to rethink the problem as a whole, and possibly return to the task setting stage.',
      C: 'I will ask the manager to give me another task.',
      D: 'I will hide the problem and pretend that everything is going according to plan.'
    },
    correctAnswer: 'B'
  },
  // Block 8: Feedback (3 questions, 5 points)
  {
    id: 's22',
    type: 'multiple',
    category: 'soft_feedback',
    weight: 2,
    text: 'You see an error in the manager\'s presentation before an important meeting.',
    options: {
      A: 'I will say nothing to avoid putting him in an awkward position.',
      B: 'I will tactfully inform him about the error one-on-one before the meeting.',
      C: 'I will point out the error publicly during his speech.',
      D: 'I will tell colleagues about the error after the meeting.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's23',
    type: 'multiple',
    category: 'soft_feedback',
    weight: 1,
    text: 'It seems to you that your manager sets unrealistic deadlines for you.',
    options: {
      A: 'I will silently agree and work at night, risking burnout.',
      B: 'I will prepare an argued assessment of deadlines, break the task into stages and suggest a realistic plan to the manager.',
      C: 'I will say that it is impossible and refuse the task.',
      D: 'I will promise to make it in time, but I will know in advance that I will miss the deadline.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's24',
    type: 'multiple',
    category: 'soft_feedback',
    weight: 2,
    text: 'Your model was criticized at the technical committee.',
    options: {
      A: 'I will take all the criticism personally and be demotivated.',
      B: 'I will separate criticism of the model from criticism of myself as a person, collect all comments and make a plan to eliminate them.',
      C: 'I will start arguing and prove that the critics do not understand the topic.',
      D: 'I will decide that ML is not for me, and start learning something else.'
    },
    correctAnswer: 'B'
  },
  // Block 9: Creativity (3 questions, 6 points)
  {
    id: 's25',
    type: 'open',
    category: 'soft_creativity',
    weight: 3,
    text: 'Situation: You need to solve a task for which there are no standard, "off-the-shelf" solutions.'
  },
  {
    id: 's26',
    type: 'multiple',
    category: 'soft_creativity',
    weight: 2,
    text: 'The manager suggests an idea that seems technically weak to you.',
    options: {
      A: 'I will immediately say that the idea is bad and will not work.',
      B: 'I will say: "Interesting idea. Let me conduct a small research and make a prototype so that we can evaluate its viability in practice".',
      C: 'I will formally agree, but do nothing.',
      D: 'I will suggest my "correct" idea instead of his.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's27',
    type: 'multiple',
    category: 'soft_creativity',
    weight: 1,
    text: 'Your team constantly uses the same approach to all tasks.',
    options: {
      A: 'This is good, as it is a standard, and everything works predictably.',
      B: 'I will suggest conducting an R&D day to study and try new methods that can increase our efficiency.',
      C: 'I will secretly try new methods in my projects.',
      D: 'I believe that if something works, there is no need to change it.'
    },
    correctAnswer: 'B'
  },
  // Block 10: Documentation (3 questions, 5 points)
  {
    id: 's28',
    type: 'multiple',
    category: 'soft_documentation',
    weight: 2,
    text: 'The project is completed, the model works. It remains to write the documentation.',
    options: {
      A: 'I consider this the least priority task and will postpone it indefinitely.',
      B: 'I consider documentation an integral part of the project and will allocate time for it.',
      C: 'I will ask a junior specialist to write documentation for my code.',
      D: 'I will write the minimum necessary to formally close the task.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's29',
    type: 'multiple',
    category: 'soft_documentation',
    weight: 2,
    text: 'You need to hand over your project to a colleague.',
    options: {
      A: 'I will just give him a link to the Git repository.',
      B: 'I will organize a meeting where I will tell in detail about the project, show key parts of the code and leave a link to detailed documentation.',
      C: 'I will record a short video with a project overview for him.',
      D: 'I will be available for questions when he starts figuring it out himself.'
    },
    correctAnswer: 'B'
  },
  {
    id: 's30',
    type: 'open',
    category: 'soft_documentation',
    weight: 1,
    text: 'What documentation style do you prefer?'
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
    const averagePercentage = totalTests > 0 ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalTests) : 0;
    const passRate = totalTests > 0 ? Math.round((results.filter(r => r.percentage >= 60).length / totalTests) * 100) : 0;
    const recentResults = results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
    return new Response(JSON.stringify({ success: true, totalTests, averagePercentage, totalQuestions: questions.length, passRate, recentResults }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to get analytics' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}





import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually — tsx does not auto-load it
try {
  const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
} catch {
  // .env.local may not exist in CI
}

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { hashSync } from "bcryptjs";
import { eq, and } from "drizzle-orm";
import {
  users,
  courses,
  videos,
  learningContent,
  enrollments,
  progress,
} from "./schema";

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, {
    schema: { users, courses, videos, learningContent, enrollments, progress },
  });

  console.log("Seeding database...");

  // Clear in reverse FK order
  await db.delete(progress);
  await db.delete(enrollments);
  await db.delete(learningContent);
  await db.delete(videos);
  await db.delete(courses);
  await db.delete(users);

  // ── Users ──────────────────────────────────────────────
  await db.insert(users).values({
    email: "admin@edupulse.io",
    passwordHash: hashSync("admin123", 10),
    fullName: "Admin User",
    role: "admin",
  });

  const [studentUser] = await db
    .insert(users)
    .values({
      email: "student@edupulse.io",
      passwordHash: hashSync("student123", 10),
      fullName: "Alex Student",
      role: "student",
    })
    .returning();

  // ── Courses ────────────────────────────────────────────

  const DIGITAL_CULTURE_COURSE_ID = "00000000-0000-4000-a000-000000000001";
  const DIGITAL_CULTURE_VIDEO_IDS = {
    1: "00000000-0000-4000-a000-000000000011",
    2: "00000000-0000-4000-a000-000000000012",
    3: "00000000-0000-4000-a000-000000000013",
    4: "00000000-0000-4000-a000-000000000014",
    5: "00000000-0000-4000-a000-000000000015",
  };

  const [digitalCultureCourse] = await db
    .insert(courses)
    .values({
      id: DIGITAL_CULTURE_COURSE_ID,
      title: "Цифровая культура банка",
      description:
        "Серия о том, как данные, точность операций и культура качества влияют на сервис, риски и устойчивость банка.",
      category: "Banking",
      thumbnailUrl: "/thumbnails/digital-culture-bank.png",
      educatorName: "НБУ",
      isPublished: true,
      sortOrder: 0,
    })
    .returning();

  const [mlCourse] = await db
    .insert(courses)
    .values({
      title: "Introduction to Machine Learning",
      description:
        "A comprehensive introduction to machine learning concepts, algorithms, and practical applications. Learn supervised and unsupervised learning, neural networks, and model evaluation techniques used in industry today.",
      thumbnailUrl: "/thumbnails/ml-course.jpg",
      category: "Computer Science",
      educatorName: "Dr. Sarah Chen",
      isPublished: true,
      sortOrder: 1,
    })
    .returning();

  const [webCourse] = await db
    .insert(courses)
    .values({
      title: "Web Development Fundamentals",
      description:
        "Master the foundations of modern web development. From HTML and CSS to JavaScript and responsive design, build real-world websites from scratch with industry best practices.",
      thumbnailUrl: "/thumbnails/web-course.jpg",
      category: "Web Development",
      educatorName: "Marcus Rivera",
      isPublished: true,
      sortOrder: 2,
    })
    .returning();

  const [dsaCourse] = await db
    .insert(courses)
    .values({
      title: "Data Structures & Algorithms",
      description:
        "Deep dive into essential data structures and algorithms. Arrays, trees, graphs, sorting, searching, and dynamic programming with real interview questions and complexity analysis.",
      thumbnailUrl: "/thumbnails/dsa-course.jpg",
      category: "Computer Science",
      educatorName: "Prof. James Okafor",
      isPublished: true,
      sortOrder: 3,
    })
    .returning();

  // ── Videos ─────────────────────────────────────────────

  // Digital Culture course — 5 episodes
  await db.insert(videos).values([
    {
      id: DIGITAL_CULTURE_VIDEO_IDS[1],
      courseId: digitalCultureCourse.id,
      title: "Выпуск 1 — Данные как основа",
      description: "Что считается банковскими данными, как ошибки каскадно влияют на системы и ответственность сотрудника.",
      videoUrl: "/videos/digital-culture-bank/episode-1-ru.mp4",
      sortOrder: 0,
    },
    {
      id: DIGITAL_CULTURE_VIDEO_IDS[2],
      courseId: digitalCultureCourse.id,
      title: "Выпуск 2 — Корпоративное хранилище данных",
      description: "Архитектура КХД, ETL-процессы, витрины данных и роль хранилища в аналитике.",
      videoUrl: "/videos/digital-culture-bank/episode-2-ru.mp4",
      sortOrder: 1,
    },
    {
      id: DIGITAL_CULTURE_VIDEO_IDS[3],
      courseId: digitalCultureCourse.id,
      title: "Выпуск 3 — Типы данных",
      description: "Структурированные, неструктурированные данные и метаданные в банковской системе.",
      videoUrl: "/videos/digital-culture-bank/episode-3-ru.mp4",
      sortOrder: 2,
    },
    {
      id: DIGITAL_CULTURE_VIDEO_IDS[4],
      courseId: digitalCultureCourse.id,
      title: "Выпуск 4 — Путь данных",
      description: "Этапы обработки данных от первичного ввода до управленческих решений.",
      videoUrl: "/videos/digital-culture-bank/episode-4-ru.mp4",
      sortOrder: 3,
    },
    {
      id: DIGITAL_CULTURE_VIDEO_IDS[5],
      courseId: digitalCultureCourse.id,
      title: "Выпуск 5 — Качество данных",
      description: "Точность, своевременность, полнота и согласованность данных и их влияние на бизнес.",
      videoUrl: "/videos/digital-culture-bank/episode-5-ru.mp4",
      sortOrder: 4,
    },
  ]);

  // ML Course — 4 videos
  const mlVideos = await db
    .insert(videos)
    .values([
      {
        courseId: mlCourse.id,
        title: "What is Machine Learning?",
        description:
          "An overview of machine learning, its history, and modern applications across industries.",
        videoUrl: "/videos/ml/lesson-1.mp4",
        thumbnailUrl: "/thumbnails/ml-lesson-1.jpg",
        durationSec: 720,
        transcript:
          "Welcome to Introduction to Machine Learning. In this first lesson, we explore what machine learning actually is and why it has become one of the most transformative fields in computer science. Machine learning is a subset of artificial intelligence that focuses on building systems that learn from data. Instead of being explicitly programmed to perform a task, these systems use algorithms to parse data, learn from it, and then make predictions or decisions. The concept dates back to the 1950s when Arthur Samuel defined it as the field of study that gives computers the ability to learn without being explicitly programmed. Today, machine learning powers everything from email spam filters and voice assistants to medical diagnosis and self-driving cars. There are three main paradigms. Supervised learning trains on labeled data — you provide input-output pairs and the algorithm learns the mapping. Unsupervised learning finds hidden patterns in data without labels — clustering and dimensionality reduction are common techniques. Reinforcement learning trains an agent through trial and error, rewarding desired behaviors. Each paradigm has distinct use cases and trade-offs. Throughout this course, we will dive deep into each with practical examples, building your intuition for when and how to apply different approaches.",
        sortOrder: 1,
      },
      {
        courseId: mlCourse.id,
        title: "Supervised Learning Fundamentals",
        description:
          "Learn about regression, classification, and how to train models with labeled data.",
        videoUrl: "/videos/ml/lesson-2.mp4",
        thumbnailUrl: "/thumbnails/ml-lesson-2.jpg",
        durationSec: 900,
        transcript:
          "Supervised learning is the most common paradigm in machine learning. It uses labeled training data to learn a mapping function from inputs to outputs. There are two main categories: regression and classification. In regression, we predict a continuous value — house prices, temperature, stock returns. In classification, we predict a discrete category — spam versus not spam, tumor benign versus malignant. The supervised learning workflow follows a consistent pattern. First, you split data into training and test sets, typically 80/20 or 70/30. Then you select a model appropriate for your problem. You train the model on the training set, adjusting its parameters to minimize a loss function. Finally, you evaluate on the test set to estimate real-world performance. Key algorithms include linear regression for continuous predictions, logistic regression for binary classification, decision trees for interpretable rule-based models, support vector machines for high-dimensional data, and k-nearest neighbors for instance-based learning. We measure model quality using metrics like accuracy, precision, recall, F1 score, and area under the ROC curve. A critical challenge is overfitting — when the model memorizes training data instead of learning generalizable patterns. Techniques like cross-validation, regularization (L1 and L2), and early stopping help combat overfitting.",
        sortOrder: 2,
      },
      {
        courseId: mlCourse.id,
        title: "Unsupervised Learning & Clustering",
        description:
          "Discover patterns in data without labels using clustering and dimensionality reduction.",
        videoUrl: "/videos/ml/lesson-3.mp4",
        thumbnailUrl: "/thumbnails/ml-lesson-3.jpg",
        durationSec: 840,
        transcript:
          "Unsupervised learning finds hidden patterns in data without labeled examples. Unlike supervised learning, there are no correct answers to guide the algorithm — it must discover structure on its own. The most common unsupervised technique is clustering, which groups similar data points together. K-means clustering partitions data into K groups by iteratively assigning each point to its nearest centroid and then recomputing centroids. You must choose K in advance, which can be guided by the elbow method or silhouette scores. DBSCAN finds clusters of arbitrary shape by examining point density — it can identify outliers and does not require specifying the number of clusters. Hierarchical clustering builds a dendrogram, a tree-like diagram showing how clusters merge or split at different distance thresholds. Another key technique is dimensionality reduction, which simplifies high-dimensional data while preserving important information. PCA (Principal Component Analysis) finds directions of maximum variance and projects data onto fewer dimensions. t-SNE maps high-dimensional data to 2D or 3D for visualization, preserving local neighborhood relationships. UMAP is a newer alternative that better preserves global structure. Practical applications include customer segmentation, anomaly detection in fraud and cybersecurity, recommendation systems, and data compression for storage and transmission efficiency.",
        sortOrder: 3,
      },
      {
        courseId: mlCourse.id,
        title: "Neural Networks & Deep Learning",
        description:
          "Introduction to neural networks, backpropagation, and deep learning architectures.",
        videoUrl: "/videos/ml/lesson-4.mp4",
        thumbnailUrl: "/thumbnails/ml-lesson-4.jpg",
        durationSec: 1080,
        transcript:
          "Neural networks are computational models inspired by the biological neurons in our brains. A neural network consists of layers of interconnected nodes called neurons. The input layer receives raw data, one or more hidden layers transform it through weighted connections and nonlinear activation functions, and the output layer produces predictions. Each connection has a weight that determines its influence. Training involves forward propagation — computing predictions layer by layer — then calculating loss to measure prediction error, and finally backpropagation — using the chain rule of calculus to compute gradients and adjust weights via gradient descent. Deep learning refers to neural networks with many hidden layers, capable of learning hierarchical representations. Convolutional Neural Networks (CNNs) excel at image and spatial data by using learnable filters to detect features like edges, textures, and objects. Recurrent Neural Networks (RNNs) and their variants LSTM and GRU handle sequential data like text and time series by maintaining memory of previous inputs. Transformers revolutionized natural language processing with the self-attention mechanism, enabling models like BERT and GPT. Key concepts include activation functions (ReLU, sigmoid, softmax), optimizers (SGD, Adam, AdaGrad), batch normalization for stable training, and dropout regularization to prevent overfitting. Deep learning demands significant computation but has achieved remarkable results across vision, language, speech, and game playing.",
        sortOrder: 4,
      },
    ])
    .returning();

  // Web Dev Course — 3 videos
  const webVideos = await db
    .insert(videos)
    .values([
      {
        courseId: webCourse.id,
        title: "HTML & Document Structure",
        description:
          "Learn the building blocks of the web with semantic HTML elements.",
        videoUrl: "/videos/web/lesson-1.mp4",
        thumbnailUrl: "/thumbnails/web-lesson-1.jpg",
        durationSec: 660,
        transcript:
          "HTML is the backbone of every web page. HyperText Markup Language provides the structure and content of web documents. Every HTML document begins with a DOCTYPE declaration that tells the browser which version of HTML to expect, followed by the html root element. Inside, the head element contains metadata — the page title, character encoding, viewport settings, and links to stylesheets. The body element holds all visible content. Semantic HTML is about choosing elements that describe their meaning rather than their appearance. Use header for introductory content, nav for navigation links, main for primary page content, article for self-contained compositions, section for thematic groups, aside for tangential content, and footer for closing information. These elements improve accessibility for screen readers, help search engines understand your content, and make your code more readable. Common content elements include headings h1 through h6 (use only one h1 per page), paragraphs p, links a with the href attribute, images img with src and alt attributes, ordered and unordered lists ol and ul, tables for tabular data, and forms for user input. Attributes provide additional information — id for unique identification, class for styling groups, and data attributes for custom metadata. Well-structured HTML is the foundation of every performant, accessible website.",
        sortOrder: 1,
      },
      {
        courseId: webCourse.id,
        title: "CSS & Visual Design",
        description:
          "Style pages with CSS layouts, animations, and responsive design principles.",
        videoUrl: "/videos/web/lesson-2.mp4",
        thumbnailUrl: "/thumbnails/web-lesson-2.jpg",
        durationSec: 780,
        transcript:
          "CSS — Cascading Style Sheets — brings visual design to your HTML structure. CSS controls layout, colors, typography, spacing, animations, and responsive behavior. The cascade determines which styles win when multiple rules target the same element: specificity (inline styles beat IDs beat classes beat elements), source order (later rules override earlier ones), and importance (!important overrides everything, but use it sparingly). Modern CSS layout relies on two powerful systems. Flexbox handles one-dimensional layouts — arranging items in a row or column with flexible sizing, alignment, and wrapping. Grid handles two-dimensional layouts — defining rows and columns simultaneously for complex page structures. Use Flexbox for component-level layouts like navigation bars and card rows, and Grid for page-level layouts. CSS custom properties (variables) let you define reusable values like colors and spacing that can be updated dynamically, even with JavaScript. Media queries enable responsive design by applying different styles at different viewport widths. The mobile-first approach starts with small-screen styles and adds complexity for larger screens using min-width breakpoints. Transitions animate property changes smoothly — hover effects, color shifts, size changes. Keyframe animations define multi-step sequences. Modern best practices include organizing styles by component, using a consistent naming convention like BEM, and leveraging custom properties for theming.",
        sortOrder: 2,
      },
      {
        courseId: webCourse.id,
        title: "JavaScript Essentials",
        description:
          "Master JavaScript fundamentals: variables, functions, DOM manipulation, and async patterns.",
        videoUrl: "/videos/web/lesson-3.mp4",
        thumbnailUrl: "/thumbnails/web-lesson-3.jpg",
        durationSec: 900,
        transcript:
          "JavaScript is the programming language of the web, running natively in every browser. Variables declared with const hold values that cannot be reassigned, while let allows reassignment — avoid var, which has confusing scoping rules. JavaScript is dynamically typed with seven primitive types: string, number, bigint, boolean, null, undefined, and symbol. Objects and arrays are reference types that store collections of data. Functions are first-class citizens — they can be stored in variables, passed as arguments, and returned from other functions. Arrow functions provide concise syntax and lexically bind this. The Document Object Model (DOM) is the browser's representation of HTML as a tree of JavaScript objects. You can query elements with querySelector and querySelectorAll, create new elements with createElement, modify content with textContent and innerHTML, and change styles with the style property or classList API. Event listeners respond to user interactions — click, keydown, submit, input — enabling dynamic, interactive pages. Modern JavaScript includes template literals for string interpolation, destructuring assignment for extracting values, the spread operator for combining arrays and objects, optional chaining for safe property access, and ES modules for organizing code across files. Asynchronous programming handles operations like network requests using Promises and the async/await syntax, keeping the UI responsive while waiting for data.",
        sortOrder: 3,
      },
    ])
    .returning();

  // DSA Course — 3 videos
  const dsaVideos = await db
    .insert(videos)
    .values([
      {
        courseId: dsaCourse.id,
        title: "Arrays, Stacks & Queues",
        description:
          "Foundation data structures: contiguous arrays, LIFO stacks, and FIFO queues.",
        videoUrl: "/videos/dsa/lesson-1.mp4",
        thumbnailUrl: "/thumbnails/dsa-lesson-1.jpg",
        durationSec: 720,
        transcript:
          "Data structures are specialized formats for organizing and storing data so it can be accessed and modified efficiently. Arrays are the most fundamental data structure — contiguous blocks of memory where each element can be accessed by its index in O(1) time. Insertion and deletion at arbitrary positions require shifting elements, costing O(n). Dynamic arrays automatically resize when capacity is exceeded, using an amortized doubling strategy. Stacks follow the Last-In-First-Out (LIFO) principle — think of a stack of plates where you can only add or remove from the top. The push operation adds an element, pop removes the top element, and peek inspects it without removal, all in O(1). Stacks power function call management (the call stack), undo functionality in editors, expression evaluation (converting infix to postfix), and depth-first search traversal. Queues follow First-In-First-Out (FIFO) — like a line at a checkout counter. Enqueue adds to the back, dequeue removes from the front, both in O(1) with a linked-list implementation. Queues are essential for breadth-first search, task scheduling in operating systems, print job management, and message buffering. Priority queues extend this concept by always dequeuing the highest-priority element, typically implemented with a binary heap for O(log n) insertion and extraction.",
        sortOrder: 1,
      },
      {
        courseId: dsaCourse.id,
        title: "Trees & Graphs",
        description:
          "Hierarchical and networked structures with traversal and search algorithms.",
        videoUrl: "/videos/dsa/lesson-2.mp4",
        thumbnailUrl: "/thumbnails/dsa-lesson-2.jpg",
        durationSec: 960,
        transcript:
          "Trees are hierarchical data structures consisting of nodes connected by edges, with a single root node at the top. Each node has zero or more children. Binary trees restrict each node to at most two children — left and right. Binary Search Trees (BSTs) maintain ordering: every left descendant holds a smaller value, every right descendant holds a larger value, enabling O(log n) search, insertion, and deletion when balanced. However, unbalanced BSTs degrade to O(n). Self-balancing trees like AVL trees (strict height balancing with rotations) and Red-Black trees (relaxed balancing with color properties) guarantee O(log n) operations. Tree traversals visit nodes in specific orders: in-order (left, root, right) yields sorted output for BSTs, pre-order (root, left, right) is useful for serialization, post-order (left, right, root) suits deletion and expression evaluation, and level-order uses a queue for breadth-first processing. Graphs generalize trees — nodes (vertices) connected by edges without the hierarchical constraint. Graphs can be directed or undirected, weighted or unweighted, and may contain cycles. Common representations are adjacency matrices (O(V²) space, O(1) edge lookup) and adjacency lists (O(V+E) space, efficient iteration). Graph traversals include BFS (level-by-level using a queue, finds shortest unweighted paths) and DFS (deep exploration using a stack or recursion). Applications span social networks, GPS routing, dependency resolution, and network analysis.",
        sortOrder: 2,
      },
      {
        courseId: dsaCourse.id,
        title: "Sorting & Searching",
        description:
          "Classic sorting algorithms, binary search, and Big-O complexity analysis.",
        videoUrl: "/videos/dsa/lesson-3.mp4",
        thumbnailUrl: "/thumbnails/dsa-lesson-3.jpg",
        durationSec: 840,
        transcript:
          "Sorting algorithms arrange elements in a specific order — ascending or descending. Simple algorithms include bubble sort (repeatedly swap adjacent out-of-order elements, O(n²)), selection sort (find the minimum and place it next, O(n²)), and insertion sort (insert each element into its correct position in the sorted portion, O(n²) but efficient for nearly-sorted data). Merge sort uses divide-and-conquer: split the array in half, recursively sort each half, then merge the sorted halves. It guarantees O(n log n) time but requires O(n) extra space. Quick sort picks a pivot, partitions elements around it, and recurses on each partition. Average case O(n log n), worst case O(n²) with poor pivot choice. Randomized pivot selection and three-way partitioning mitigate worst cases. In practice, quick sort often outperforms merge sort due to better cache locality. Heap sort builds a max-heap and repeatedly extracts the maximum, achieving O(n log n) in-place with no extra memory. Searching in unsorted data requires O(n) linear scan. Binary search on sorted data repeatedly halves the search space, achieving O(log n) — one of the most powerful algorithmic patterns. Hash tables provide O(1) average-case lookup by mapping keys through a hash function to array indices, with collision resolution via chaining or open addressing. Understanding Big-O notation — how time and space grow with input size — is essential for choosing the right algorithm and succeeding in technical interviews.",
        sortOrder: 3,
      },
    ])
    .returning();

  // ── Learning Content ───────────────────────────────────

  const allVideos = [...mlVideos, ...webVideos, ...dsaVideos];

  // Helper: build quiz content for each video
  interface QuizQuestion {
    id: string;
    question: string;
    options: { A: string; B: string; C: string; D: string };
    correct: string;
    difficulty: string;
    explanation: string;
  }

  const quizData: Record<string, { questions: QuizQuestion[] }> = {};

  // ML Video 1 Quiz
  quizData[mlVideos[0].id] = {
    questions: [
      { id: "q_ml1_1", question: "What is machine learning best described as?", options: { A: "A set of hard-coded rules for decision making", B: "A field focused on systems that learn from data without explicit programming", C: "A technique for manually labeling datasets", D: "A hardware optimization method for CPUs" }, correct: "B", difficulty: "easy", explanation: "Arthur Samuel defined ML as giving computers the ability to learn without being explicitly programmed." },
      { id: "q_ml1_2", question: "Which paradigm trains an agent through trial, error, and rewards?", options: { A: "Supervised learning", B: "Unsupervised learning", C: "Reinforcement learning", D: "Semi-supervised learning" }, correct: "C", difficulty: "easy", explanation: "Reinforcement learning uses a reward signal to train an agent through interaction with an environment." },
      { id: "q_ml1_3", question: "In supervised learning, what must the training data contain?", options: { A: "Only input features", B: "Input-output pairs (labels)", C: "Reward signals", D: "Unlabeled clusters" }, correct: "B", difficulty: "medium", explanation: "Supervised learning requires labeled data — each input paired with its correct output." },
      { id: "q_ml1_4", question: "Which application is an example of unsupervised learning?", options: { A: "Email spam detection", B: "Customer segmentation", C: "Image classification with labels", D: "Language translation" }, correct: "B", difficulty: "medium", explanation: "Customer segmentation groups similar customers without predefined labels, a classic unsupervised task." },
      { id: "q_ml1_5", question: "Who coined the term 'machine learning' in the 1950s?", options: { A: "Alan Turing", B: "John McCarthy", C: "Arthur Samuel", D: "Marvin Minsky" }, correct: "C", difficulty: "hard", explanation: "Arthur Samuel coined the term while working at IBM on a checkers-playing program." },
    ],
  };

  // ML Video 2 Quiz
  quizData[mlVideos[1].id] = {
    questions: [
      { id: "q_ml2_1", question: "What distinguishes regression from classification?", options: { A: "Regression uses neural networks; classification does not", B: "Regression predicts continuous values; classification predicts discrete categories", C: "Regression is unsupervised; classification is supervised", D: "There is no difference" }, correct: "B", difficulty: "easy", explanation: "Regression outputs continuous values (e.g., price) while classification outputs categories (e.g., spam/not spam)." },
      { id: "q_ml2_2", question: "What is overfitting?", options: { A: "The model performs poorly on training data", B: "The model memorizes training data and fails on new data", C: "The model is too simple to capture patterns", D: "The model trains too quickly" }, correct: "B", difficulty: "easy", explanation: "Overfitting means the model has learned noise in the training data rather than the underlying pattern." },
      { id: "q_ml2_3", question: "Which metric is most appropriate for imbalanced classification?", options: { A: "Accuracy", B: "Mean squared error", C: "F1 score", D: "R-squared" }, correct: "C", difficulty: "medium", explanation: "F1 score balances precision and recall, making it more informative than accuracy when classes are imbalanced." },
      { id: "q_ml2_4", question: "What is the purpose of cross-validation?", options: { A: "To increase the training set size", B: "To estimate model performance on unseen data more reliably", C: "To speed up training", D: "To visualize data" }, correct: "B", difficulty: "medium", explanation: "Cross-validation splits data into multiple folds and averages performance, giving a more robust estimate." },
      { id: "q_ml2_5", question: "L2 regularization adds what to the loss function?", options: { A: "Sum of absolute weights", B: "Sum of squared weights", C: "Number of features", D: "Training set size" }, correct: "B", difficulty: "hard", explanation: "L2 (Ridge) regularization penalizes the sum of squared weights, encouraging smaller parameter values." },
    ],
  };

  // ML Video 3 Quiz
  quizData[mlVideos[2].id] = {
    questions: [
      { id: "q_ml3_1", question: "What does K-means clustering require you to specify in advance?", options: { A: "The distance metric only", B: "The number of clusters K", C: "The cluster labels", D: "The maximum iterations" }, correct: "B", difficulty: "easy", explanation: "K-means requires the number of clusters K as a parameter before running." },
      { id: "q_ml3_2", question: "Which algorithm can find clusters of arbitrary shape?", options: { A: "K-means", B: "Linear regression", C: "DBSCAN", D: "PCA" }, correct: "C", difficulty: "medium", explanation: "DBSCAN groups points by density, so it can discover clusters of any shape, unlike K-means which produces spherical clusters." },
      { id: "q_ml3_3", question: "What does PCA find in data?", options: { A: "Cluster boundaries", B: "Directions of maximum variance", C: "Optimal K value", D: "Missing labels" }, correct: "B", difficulty: "medium", explanation: "PCA identifies principal components — the orthogonal directions along which data variance is maximized." },
      { id: "q_ml3_4", question: "t-SNE is primarily used for what purpose?", options: { A: "Training classifiers", B: "Visualization of high-dimensional data", C: "Feature selection", D: "Data augmentation" }, correct: "B", difficulty: "easy", explanation: "t-SNE maps high-dimensional data to 2D or 3D for visual exploration while preserving local structure." },
      { id: "q_ml3_5", question: "Which method helps choose the optimal K for K-means?", options: { A: "Backpropagation", B: "Gradient descent", C: "The elbow method", D: "Cross-validation" }, correct: "C", difficulty: "medium", explanation: "The elbow method plots within-cluster variance against K and identifies the 'elbow' where adding clusters yields diminishing returns." },
    ],
  };

  // ML Video 4 Quiz
  quizData[mlVideos[3].id] = {
    questions: [
      { id: "q_ml4_1", question: "What is backpropagation used for in neural networks?", options: { A: "Forward computation of predictions", B: "Computing gradients to update weights", C: "Initializing network weights", D: "Selecting the network architecture" }, correct: "B", difficulty: "easy", explanation: "Backpropagation uses the chain rule to compute gradients of the loss with respect to each weight for optimization." },
      { id: "q_ml4_2", question: "Which architecture is best suited for image recognition?", options: { A: "RNN", B: "CNN", C: "Simple feedforward network", D: "Autoencoder" }, correct: "B", difficulty: "easy", explanation: "CNNs use convolutional filters that detect spatial features like edges and textures, making them ideal for images." },
      { id: "q_ml4_3", question: "What mechanism makes Transformers effective for NLP?", options: { A: "Convolution filters", B: "Recurrent connections", C: "Self-attention", D: "Pooling layers" }, correct: "C", difficulty: "medium", explanation: "Self-attention allows each token to attend to all other tokens, capturing long-range dependencies without recurrence." },
      { id: "q_ml4_4", question: "What does dropout do during training?", options: { A: "Speeds up forward propagation", B: "Randomly deactivates neurons to prevent overfitting", C: "Increases learning rate", D: "Normalizes inputs to each layer" }, correct: "B", difficulty: "medium", explanation: "Dropout randomly zeroes out a fraction of neuron activations, forcing the network to learn redundant representations." },
      { id: "q_ml4_5", question: "ReLU activation outputs what for negative inputs?", options: { A: "The input value unchanged", B: "A value between 0 and 1", C: "Zero", D: "The absolute value" }, correct: "C", difficulty: "hard", explanation: "ReLU (Rectified Linear Unit) outputs max(0, x) — zero for negative inputs and the input itself for positive values." },
    ],
  };

  // Web Video 1 Quiz
  quizData[webVideos[0].id] = {
    questions: [
      { id: "q_web1_1", question: "What does HTML stand for?", options: { A: "High-level Text Markup Language", B: "HyperText Markup Language", C: "HyperText Machine Language", D: "Home Tool Markup Language" }, correct: "B", difficulty: "easy", explanation: "HTML stands for HyperText Markup Language, the standard markup language for creating web pages." },
      { id: "q_web1_2", question: "Which element should contain the page's navigation links?", options: { A: "<div>", B: "<section>", C: "<nav>", D: "<aside>" }, correct: "C", difficulty: "easy", explanation: "The <nav> element semantically represents a section of navigation links." },
      { id: "q_web1_3", question: "How many <h1> elements should a page typically have?", options: { A: "As many as needed", B: "Zero", C: "Exactly one", D: "One per section" }, correct: "C", difficulty: "medium", explanation: "Best practice is one <h1> per page representing the main heading, with h2-h6 for subsections." },
      { id: "q_web1_4", question: "What attribute makes images accessible to screen readers?", options: { A: "title", B: "src", C: "alt", D: "name" }, correct: "C", difficulty: "easy", explanation: "The alt attribute provides alternative text that screen readers announce when encountering an image." },
      { id: "q_web1_5", question: "Which element is best for self-contained content like a blog post?", options: { A: "<section>", B: "<article>", C: "<main>", D: "<div>" }, correct: "B", difficulty: "medium", explanation: "The <article> element represents self-contained content that could stand independently, like a blog post." },
    ],
  };

  // Web Video 2 Quiz
  quizData[webVideos[1].id] = {
    questions: [
      { id: "q_web2_1", question: "What does the 'C' in CSS stand for?", options: { A: "Creative", B: "Cascading", C: "Computed", D: "Conditional" }, correct: "B", difficulty: "easy", explanation: "CSS stands for Cascading Style Sheets — 'cascading' refers to how styles are applied by priority." },
      { id: "q_web2_2", question: "Which layout system is best for two-dimensional page layouts?", options: { A: "Flexbox", B: "Float", C: "CSS Grid", D: "Inline-block" }, correct: "C", difficulty: "easy", explanation: "CSS Grid handles rows and columns simultaneously, making it ideal for two-dimensional page layouts." },
      { id: "q_web2_3", question: "In the cascade, which selector has the highest specificity?", options: { A: "Element selector (p)", B: "Class selector (.text)", C: "ID selector (#header)", D: "Universal selector (*)" }, correct: "C", difficulty: "medium", explanation: "ID selectors have specificity (1,0,0), higher than class (0,1,0) and element (0,0,1) selectors." },
      { id: "q_web2_4", question: "What does a mobile-first approach use for larger screens?", options: { A: "max-width media queries", B: "min-width media queries", C: "No media queries", D: "print media queries" }, correct: "B", difficulty: "medium", explanation: "Mobile-first writes base styles for small screens, then adds complexity with min-width breakpoints for larger screens." },
      { id: "q_web2_5", question: "CSS custom properties are declared with what prefix?", options: { A: "$", B: "@", C: "--", D: "#" }, correct: "C", difficulty: "easy", explanation: "CSS custom properties (variables) use the -- prefix, e.g., --primary-color: blue." },
    ],
  };

  // Web Video 3 Quiz
  quizData[webVideos[2].id] = {
    questions: [
      { id: "q_web3_1", question: "Which keyword declares a variable that cannot be reassigned?", options: { A: "var", B: "let", C: "const", D: "static" }, correct: "C", difficulty: "easy", explanation: "const declares a binding that cannot be reassigned, though object properties can still be mutated." },
      { id: "q_web3_2", question: "What does the DOM represent?", options: { A: "The CSS stylesheet", B: "The HTML document as a tree of objects", C: "The JavaScript runtime", D: "The browser's network layer" }, correct: "B", difficulty: "easy", explanation: "The Document Object Model represents HTML as a tree of JavaScript objects that can be queried and manipulated." },
      { id: "q_web3_3", question: "What does async/await help manage?", options: { A: "CSS transitions", B: "Synchronous loops", C: "Asynchronous operations like network requests", D: "Memory allocation" }, correct: "C", difficulty: "medium", explanation: "async/await provides a clean syntax for working with Promises, making asynchronous code read like synchronous code." },
      { id: "q_web3_4", question: "Which method selects the first matching DOM element?", options: { A: "getElementById", B: "getElementsByClassName", C: "querySelector", D: "querySelectorAll" }, correct: "C", difficulty: "medium", explanation: "querySelector returns the first element matching a CSS selector; querySelectorAll returns all matches." },
      { id: "q_web3_5", question: "Arrow functions differ from regular functions in how they bind what?", options: { A: "arguments", B: "return values", C: "this", D: "parameters" }, correct: "C", difficulty: "hard", explanation: "Arrow functions lexically bind 'this' from the enclosing scope, unlike regular functions which bind 'this' based on how they're called." },
    ],
  };

  // DSA Video 1 Quiz
  quizData[dsaVideos[0].id] = {
    questions: [
      { id: "q_dsa1_1", question: "What is the time complexity of accessing an array element by index?", options: { A: "O(n)", B: "O(log n)", C: "O(1)", D: "O(n²)" }, correct: "C", difficulty: "easy", explanation: "Arrays store elements contiguously, so any element can be accessed directly by computing its memory address in O(1)." },
      { id: "q_dsa1_2", question: "Which principle does a stack follow?", options: { A: "FIFO", B: "LIFO", C: "Priority-based", D: "Random access" }, correct: "B", difficulty: "easy", explanation: "Stacks follow Last-In-First-Out: the most recently added element is the first one removed." },
      { id: "q_dsa1_3", question: "Which data structure is used in breadth-first search?", options: { A: "Stack", B: "Array", C: "Queue", D: "Linked list" }, correct: "C", difficulty: "medium", explanation: "BFS uses a queue to process nodes level by level, ensuring the closest nodes are visited first." },
      { id: "q_dsa1_4", question: "What is the amortized time complexity of appending to a dynamic array?", options: { A: "O(n)", B: "O(1)", C: "O(log n)", D: "O(n²)" }, correct: "B", difficulty: "medium", explanation: "Although occasional resizing costs O(n), the amortized cost per append operation is O(1) due to the doubling strategy." },
      { id: "q_dsa1_5", question: "A priority queue is typically implemented with which structure?", options: { A: "Linked list", B: "Hash table", C: "Binary heap", D: "Stack" }, correct: "C", difficulty: "hard", explanation: "Binary heaps provide O(log n) insertion and extraction of the minimum/maximum, ideal for priority queues." },
    ],
  };

  // DSA Video 2 Quiz
  quizData[dsaVideos[1].id] = {
    questions: [
      { id: "q_dsa2_1", question: "In a BST, where are values smaller than the root stored?", options: { A: "Right subtree", B: "Left subtree", C: "Parent node", D: "Leaf nodes only" }, correct: "B", difficulty: "easy", explanation: "In a Binary Search Tree, all values smaller than a node are in its left subtree, larger values in the right." },
      { id: "q_dsa2_2", question: "What traversal order yields sorted output from a BST?", options: { A: "Pre-order", B: "Post-order", C: "In-order", D: "Level-order" }, correct: "C", difficulty: "easy", explanation: "In-order traversal (left, root, right) visits BST nodes in ascending sorted order." },
      { id: "q_dsa2_3", question: "What is the worst-case time complexity of search in an unbalanced BST?", options: { A: "O(1)", B: "O(log n)", C: "O(n)", D: "O(n log n)" }, correct: "C", difficulty: "medium", explanation: "An unbalanced BST can degrade to a linked list, making search linear O(n)." },
      { id: "q_dsa2_4", question: "How is a graph typically represented for sparse data?", options: { A: "Adjacency matrix", B: "Adjacency list", C: "Binary tree", D: "Hash map of stacks" }, correct: "B", difficulty: "medium", explanation: "Adjacency lists use O(V+E) space, which is more efficient than O(V²) adjacency matrices for sparse graphs." },
      { id: "q_dsa2_5", question: "DFS uses which underlying data structure?", options: { A: "Queue", B: "Priority queue", C: "Stack (or recursion)", D: "Array" }, correct: "C", difficulty: "easy", explanation: "Depth-first search uses a stack (explicit or via recursion) to explore as deep as possible before backtracking." },
    ],
  };

  // DSA Video 3 Quiz
  quizData[dsaVideos[2].id] = {
    questions: [
      { id: "q_dsa3_1", question: "What is the time complexity of merge sort?", options: { A: "O(n)", B: "O(n²)", C: "O(n log n)", D: "O(log n)" }, correct: "C", difficulty: "easy", explanation: "Merge sort divides in O(log n) levels and merges O(n) elements at each level, giving O(n log n) total." },
      { id: "q_dsa3_2", question: "Binary search requires the data to be what?", options: { A: "Unique", B: "Sorted", C: "Numeric", D: "Linked" }, correct: "B", difficulty: "easy", explanation: "Binary search works by halving the search space, which requires elements to be in sorted order." },
      { id: "q_dsa3_3", question: "Which sorting algorithm is typically fastest in practice for general data?", options: { A: "Bubble sort", B: "Merge sort", C: "Quick sort", D: "Selection sort" }, correct: "C", difficulty: "medium", explanation: "Quick sort is often fastest in practice due to excellent cache locality and low constant factors, despite O(n²) worst case." },
      { id: "q_dsa3_4", question: "Hash tables achieve O(1) average lookup using what?", options: { A: "Binary search", B: "A hash function mapping keys to indices", C: "Sorted arrays", D: "Tree traversal" }, correct: "B", difficulty: "medium", explanation: "Hash functions compute an array index from a key, providing constant-time average access." },
      { id: "q_dsa3_5", question: "What is the space complexity of merge sort?", options: { A: "O(1)", B: "O(log n)", C: "O(n)", D: "O(n²)" }, correct: "C", difficulty: "hard", explanation: "Merge sort requires O(n) additional space to hold the merged subarrays during the merge step." },
    ],
  };

  // Insert all quizzes
  for (const video of allVideos) {
    await db.insert(learningContent).values({
      videoId: video.id,
      contentType: "quiz",
      content: quizData[video.id],
    });
  }

  // ── Flashcards ─────────────────────────────────────────

  const flashcardData: Record<string, { cards: Array<{ id: string; front: string; back: string; topic: string }> }> = {
    [mlVideos[0].id]: { cards: [
      { id: "fc_ml1_1", front: "What is machine learning?", back: "A subset of AI where systems learn from data to make predictions without being explicitly programmed.", topic: "Core Concepts" },
      { id: "fc_ml1_2", front: "What are the three main ML paradigms?", back: "Supervised learning (labeled data), unsupervised learning (unlabeled data), and reinforcement learning (trial-and-error with rewards).", topic: "Core Concepts" },
      { id: "fc_ml1_3", front: "Who defined machine learning in the 1950s?", back: "Arthur Samuel — he described it as giving computers the ability to learn without explicit programming.", topic: "History" },
      { id: "fc_ml1_4", front: "What is supervised learning?", back: "Training on labeled input-output pairs so the model learns to map new inputs to correct outputs.", topic: "Core Concepts" },
      { id: "fc_ml1_5", front: "What is unsupervised learning?", back: "Finding hidden patterns or structure in data that has no predefined labels.", topic: "Core Concepts" },
      { id: "fc_ml1_6", front: "What is reinforcement learning?", back: "An agent learns optimal actions through trial and error, receiving rewards or penalties from an environment.", topic: "Core Concepts" },
      { id: "fc_ml1_7", front: "Name two real-world ML applications.", back: "Email spam filtering and self-driving cars — both use learned models instead of hand-written rules.", topic: "Applications" },
      { id: "fc_ml1_8", front: "What makes ML different from traditional programming?", back: "Traditional programming uses explicit rules; ML learns rules from data automatically.", topic: "Core Concepts" },
    ]},
    [mlVideos[1].id]: { cards: [
      { id: "fc_ml2_1", front: "Regression vs. Classification?", back: "Regression predicts continuous values (e.g., price); classification predicts discrete categories (e.g., spam/not spam).", topic: "Core Concepts" },
      { id: "fc_ml2_2", front: "What is overfitting?", back: "When a model memorizes training data noise instead of learning the underlying pattern, performing poorly on new data.", topic: "Core Concepts" },
      { id: "fc_ml2_3", front: "What is cross-validation?", back: "Splitting data into multiple folds, training on some and testing on others, to get a robust performance estimate.", topic: "Evaluation" },
      { id: "fc_ml2_4", front: "What does the F1 score measure?", back: "The harmonic mean of precision and recall — useful for imbalanced datasets where accuracy is misleading.", topic: "Evaluation" },
      { id: "fc_ml2_5", front: "What is L1 regularization?", back: "Adding the sum of absolute weights to the loss function, encouraging sparsity by driving some weights to zero.", topic: "Regularization" },
      { id: "fc_ml2_6", front: "What is L2 regularization?", back: "Adding the sum of squared weights to the loss, discouraging large weights and reducing overfitting.", topic: "Regularization" },
      { id: "fc_ml2_7", front: "What is a decision tree?", back: "A model that makes predictions by learning a series of if-then rules from the data, forming a tree structure.", topic: "Algorithms" },
      { id: "fc_ml2_8", front: "Why split data into train and test sets?", back: "To evaluate model performance on unseen data, ensuring the model generalizes beyond the training examples.", topic: "Evaluation" },
    ]},
    [mlVideos[2].id]: { cards: [
      { id: "fc_ml3_1", front: "How does K-means work?", back: "Assign each point to its nearest centroid, recompute centroids, repeat until convergence.", topic: "Clustering" },
      { id: "fc_ml3_2", front: "What is DBSCAN?", back: "Density-based clustering that groups nearby points and can discover arbitrarily shaped clusters and outliers.", topic: "Clustering" },
      { id: "fc_ml3_3", front: "What is PCA?", back: "Principal Component Analysis — projects data onto directions of maximum variance to reduce dimensionality.", topic: "Dimensionality Reduction" },
      { id: "fc_ml3_4", front: "What is the elbow method?", back: "Plot within-cluster variance vs. K and pick the K where the curve bends — diminishing returns after the 'elbow'.", topic: "Clustering" },
      { id: "fc_ml3_5", front: "What is t-SNE used for?", back: "Visualizing high-dimensional data in 2D/3D while preserving local neighborhood relationships.", topic: "Dimensionality Reduction" },
      { id: "fc_ml3_6", front: "What is hierarchical clustering?", back: "Builds a tree (dendrogram) of clusters by iteratively merging or splitting based on distance thresholds.", topic: "Clustering" },
      { id: "fc_ml3_7", front: "Name a use case for anomaly detection.", back: "Fraud detection — unsupervised models flag transactions that deviate from normal spending patterns.", topic: "Applications" },
      { id: "fc_ml3_8", front: "How does UMAP compare to t-SNE?", back: "UMAP is faster and better preserves global data structure while still showing local clusters.", topic: "Dimensionality Reduction" },
    ]},
    [mlVideos[3].id]: { cards: [
      { id: "fc_ml4_1", front: "What is backpropagation?", back: "An algorithm using the chain rule to compute gradients of the loss with respect to each weight, enabling gradient descent.", topic: "Training" },
      { id: "fc_ml4_2", front: "What is a CNN?", back: "Convolutional Neural Network — uses learnable filters to detect spatial features, excelling at image tasks.", topic: "Architectures" },
      { id: "fc_ml4_3", front: "What is an RNN?", back: "Recurrent Neural Network — processes sequential data by maintaining hidden state across time steps.", topic: "Architectures" },
      { id: "fc_ml4_4", front: "What is the ReLU activation function?", back: "Outputs max(0, x) — zero for negative inputs, the input value for positives. Simple and effective.", topic: "Components" },
      { id: "fc_ml4_5", front: "What is dropout?", back: "Randomly deactivating neurons during training to prevent co-adaptation and reduce overfitting.", topic: "Regularization" },
      { id: "fc_ml4_6", front: "What makes Transformers powerful for NLP?", back: "Self-attention lets each token attend to all others, capturing long-range dependencies without sequential processing.", topic: "Architectures" },
      { id: "fc_ml4_7", front: "What is a loss function?", back: "Measures how wrong predictions are — guides the optimizer to adjust weights and improve the model.", topic: "Training" },
      { id: "fc_ml4_8", front: "Batch normalization does what?", back: "Normalizes layer inputs to stabilize and speed up training by reducing internal covariate shift.", topic: "Components" },
    ]},
    [webVideos[0].id]: { cards: [
      { id: "fc_web1_1", front: "What is semantic HTML?", back: "Using HTML elements that describe meaning (header, nav, article) rather than generic containers (div, span).", topic: "Core Concepts" },
      { id: "fc_web1_2", front: "What does the <head> element contain?", back: "Metadata: page title, charset, viewport settings, links to stylesheets and scripts.", topic: "Structure" },
      { id: "fc_web1_3", front: "What is the alt attribute for?", back: "Provides alternative text for images — used by screen readers and shown if the image fails to load.", topic: "Accessibility" },
      { id: "fc_web1_4", front: "Difference between <section> and <article>?", back: "Article is self-contained content; section is a thematic grouping within a page or article.", topic: "Core Concepts" },
      { id: "fc_web1_5", front: "What does DOCTYPE declare?", back: "Tells the browser which HTML version to use — <!DOCTYPE html> triggers standards mode in modern browsers.", topic: "Structure" },
      { id: "fc_web1_6", front: "When should you use a <table>?", back: "Only for tabular data (rows and columns of related information). Never for layout purposes.", topic: "Best Practices" },
      { id: "fc_web1_7", front: "What are data attributes?", back: "Custom attributes (data-*) for storing extra information on HTML elements, accessible via JavaScript.", topic: "Advanced" },
      { id: "fc_web1_8", front: "Why use <main>?", back: "Marks the primary content area. Helps screen readers skip navigation and go directly to the content.", topic: "Accessibility" },
    ]},
    [webVideos[1].id]: { cards: [
      { id: "fc_web2_1", front: "Flexbox vs. Grid?", back: "Flexbox is one-dimensional (row or column); Grid is two-dimensional (rows and columns simultaneously).", topic: "Layout" },
      { id: "fc_web2_2", front: "What is CSS specificity order?", back: "Inline > ID (#) > Class (.) > Element. Higher specificity wins when multiple rules target the same element.", topic: "Core Concepts" },
      { id: "fc_web2_3", front: "What are CSS custom properties?", back: "Variables defined with -- prefix (e.g., --color: blue) that can be reused and updated dynamically.", topic: "Core Concepts" },
      { id: "fc_web2_4", front: "What is a mobile-first approach?", back: "Writing base styles for small screens first, then adding complexity for larger screens using min-width media queries.", topic: "Responsive Design" },
      { id: "fc_web2_5", front: "How do CSS transitions work?", back: "Smoothly animate property changes over a specified duration — e.g., color change on hover over 0.3 seconds.", topic: "Animation" },
      { id: "fc_web2_6", front: "What does !important do?", back: "Overrides all other specificity rules. Use sparingly — it makes debugging cascade issues much harder.", topic: "Core Concepts" },
      { id: "fc_web2_7", front: "What is BEM naming?", back: "Block-Element-Modifier: a CSS naming convention (e.g., .card__title--active) for maintainable stylesheets.", topic: "Best Practices" },
      { id: "fc_web2_8", front: "What do media queries enable?", back: "Applying different styles at different viewport sizes, device types, or user preferences (e.g., prefers-dark-mode).", topic: "Responsive Design" },
    ]},
    [webVideos[2].id]: { cards: [
      { id: "fc_web3_1", front: "const vs. let?", back: "const cannot be reassigned after declaration; let can be. Both are block-scoped, unlike var.", topic: "Core Concepts" },
      { id: "fc_web3_2", front: "What is the DOM?", back: "Document Object Model — the browser's tree representation of HTML that JavaScript can query and manipulate.", topic: "Core Concepts" },
      { id: "fc_web3_3", front: "What is a Promise?", back: "An object representing a future value — can be pending, fulfilled (resolved), or rejected.", topic: "Async" },
      { id: "fc_web3_4", front: "What does querySelector return?", back: "The first DOM element matching a CSS selector, or null if none match.", topic: "DOM" },
      { id: "fc_web3_5", front: "What are arrow functions?", back: "Concise function syntax (=>) that lexically binds 'this' from the enclosing scope.", topic: "Core Concepts" },
      { id: "fc_web3_6", front: "What is destructuring?", back: "Extracting values from arrays/objects into variables: const { name, age } = person;", topic: "Syntax" },
      { id: "fc_web3_7", front: "What is event delegation?", back: "Attaching one event listener to a parent to handle events from its children via event bubbling.", topic: "DOM" },
      { id: "fc_web3_8", front: "What does async/await do?", back: "Syntactic sugar for Promises — makes asynchronous code read like synchronous code using await to pause for results.", topic: "Async" },
    ]},
    [dsaVideos[0].id]: { cards: [
      { id: "fc_dsa1_1", front: "Array access time complexity?", back: "O(1) — elements are stored contiguously so any index can be computed directly from the base address.", topic: "Arrays" },
      { id: "fc_dsa1_2", front: "Stack: LIFO or FIFO?", back: "LIFO — Last-In-First-Out. Push adds to top, pop removes from top.", topic: "Stacks" },
      { id: "fc_dsa1_3", front: "Queue: LIFO or FIFO?", back: "FIFO — First-In-First-Out. Enqueue adds to back, dequeue removes from front.", topic: "Queues" },
      { id: "fc_dsa1_4", front: "What is a priority queue?", back: "A queue where elements have priorities — the highest-priority element is dequeued first, not the oldest.", topic: "Queues" },
      { id: "fc_dsa1_5", front: "What data structure powers the call stack?", back: "A stack — each function call pushes a frame, returning pops it. Enables recursion.", topic: "Stacks" },
      { id: "fc_dsa1_6", front: "Dynamic array resizing strategy?", back: "Double capacity when full. Amortized O(1) append — occasional O(n) copies are spread across many operations.", topic: "Arrays" },
      { id: "fc_dsa1_7", front: "Array insertion at index i costs?", back: "O(n) — all elements from i onward must be shifted right to make room.", topic: "Arrays" },
      { id: "fc_dsa1_8", front: "Where are queues used in algorithms?", back: "BFS traversal, task scheduling, print job management, and message buffering systems.", topic: "Applications" },
    ]},
    [dsaVideos[1].id]: { cards: [
      { id: "fc_dsa2_1", front: "BST search time complexity (balanced)?", back: "O(log n) — each comparison eliminates half the remaining nodes.", topic: "Trees" },
      { id: "fc_dsa2_2", front: "In-order traversal of a BST gives?", back: "Nodes in ascending sorted order (left → root → right).", topic: "Trees" },
      { id: "fc_dsa2_3", front: "Adjacency list vs. adjacency matrix?", back: "List: O(V+E) space, efficient iteration. Matrix: O(V²) space, O(1) edge lookup.", topic: "Graphs" },
      { id: "fc_dsa2_4", front: "BFS vs. DFS?", back: "BFS explores level-by-level (queue), finds shortest paths. DFS goes deep first (stack/recursion), uses less memory.", topic: "Graphs" },
      { id: "fc_dsa2_5", front: "What is an AVL tree?", back: "A self-balancing BST that uses rotations to maintain height balance (left/right heights differ by at most 1).", topic: "Trees" },
      { id: "fc_dsa2_6", front: "What is a directed graph?", back: "A graph where edges have direction — an edge from A to B does not imply an edge from B to A.", topic: "Graphs" },
      { id: "fc_dsa2_7", front: "Pre-order traversal visits nodes in what order?", back: "Root → Left → Right. Useful for creating a copy of the tree or serialization.", topic: "Trees" },
      { id: "fc_dsa2_8", front: "What is a cycle in a graph?", back: "A path that starts and ends at the same vertex. Trees are acyclic graphs by definition.", topic: "Graphs" },
    ]},
    [dsaVideos[2].id]: { cards: [
      { id: "fc_dsa3_1", front: "Merge sort time and space?", back: "Time: O(n log n) guaranteed. Space: O(n) for the merge step.", topic: "Sorting" },
      { id: "fc_dsa3_2", front: "Quick sort average vs. worst case?", back: "Average: O(n log n). Worst: O(n²) with bad pivot selection. Randomized pivots help avoid worst case.", topic: "Sorting" },
      { id: "fc_dsa3_3", front: "Binary search time complexity?", back: "O(log n) — halves the search space with each comparison. Requires sorted data.", topic: "Searching" },
      { id: "fc_dsa3_4", front: "Hash table average lookup time?", back: "O(1) average case. Worst case O(n) if many collisions.", topic: "Searching" },
      { id: "fc_dsa3_5", front: "Why is quick sort often faster than merge sort?", back: "Better cache locality (in-place partitioning) and lower constant factors despite the same O(n log n) average.", topic: "Sorting" },
      { id: "fc_dsa3_6", front: "What is Big-O notation?", back: "Describes how algorithm time/space grows with input size — focuses on the dominant term and worst case.", topic: "Complexity" },
      { id: "fc_dsa3_7", front: "Insertion sort is efficient for?", back: "Small or nearly-sorted datasets — O(n) best case when data is already sorted.", topic: "Sorting" },
      { id: "fc_dsa3_8", front: "How does heap sort work?", back: "Build a max-heap, repeatedly extract the max and place it at the end. O(n log n) in-place.", topic: "Sorting" },
    ]},
  };

  for (const video of allVideos) {
    await db.insert(learningContent).values({
      videoId: video.id,
      contentType: "flashcards",
      content: flashcardData[video.id],
    });
  }

  // ── Mental Maps ────────────────────────────────────────

  const mentalMapData: Record<string, object> = {
    [mlVideos[0].id]: { root: { id: "node_root", label: "Machine Learning", children: [
      { id: "node_1", label: "Supervised Learning", relationship: "paradigm", is_key_takeaway: true, children: [
        { id: "node_1_1", label: "Labeled Data", relationship: "requires", is_key_takeaway: false, children: [] },
        { id: "node_1_2", label: "Classification & Regression", relationship: "includes", is_key_takeaway: false, children: [] },
        { id: "node_1_3", label: "Spam Filters", relationship: "example", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_2", label: "Unsupervised Learning", relationship: "paradigm", is_key_takeaway: true, children: [
        { id: "node_2_1", label: "No Labels", relationship: "characteristic", is_key_takeaway: false, children: [] },
        { id: "node_2_2", label: "Clustering & Reduction", relationship: "includes", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_3", label: "Reinforcement Learning", relationship: "paradigm", is_key_takeaway: false, children: [
        { id: "node_3_1", label: "Trial and Error", relationship: "method", is_key_takeaway: false, children: [] },
        { id: "node_3_2", label: "Reward Signal", relationship: "uses", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_4", label: "History & Applications", relationship: "context", is_key_takeaway: false, children: [
        { id: "node_4_1", label: "Arthur Samuel (1950s)", relationship: "origin", is_key_takeaway: false, children: [] },
        { id: "node_4_2", label: "Self-Driving Cars", relationship: "modern application", is_key_takeaway: false, children: [] },
      ]},
    ]}},
    [mlVideos[1].id]: { root: { id: "node_root", label: "Supervised Learning", children: [
      { id: "node_1", label: "Regression", relationship: "type", is_key_takeaway: true, children: [
        { id: "node_1_1", label: "Continuous Output", relationship: "predicts", is_key_takeaway: false, children: [] },
        { id: "node_1_2", label: "Linear Regression", relationship: "algorithm", is_key_takeaway: false, children: [] },
        { id: "node_1_3", label: "House Prices", relationship: "example", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_2", label: "Classification", relationship: "type", is_key_takeaway: true, children: [
        { id: "node_2_1", label: "Discrete Labels", relationship: "predicts", is_key_takeaway: false, children: [] },
        { id: "node_2_2", label: "Logistic Regression & SVM", relationship: "algorithms", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_3", label: "Evaluation Metrics", relationship: "measured by", is_key_takeaway: false, children: [
        { id: "node_3_1", label: "Accuracy, Precision, Recall", relationship: "includes", is_key_takeaway: false, children: [] },
        { id: "node_3_2", label: "F1 Score & ROC AUC", relationship: "includes", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_4", label: "Overfitting Prevention", relationship: "challenge", is_key_takeaway: false, children: [
        { id: "node_4_1", label: "Cross-Validation", relationship: "technique", is_key_takeaway: false, children: [] },
        { id: "node_4_2", label: "Regularization (L1/L2)", relationship: "technique", is_key_takeaway: false, children: [] },
      ]},
    ]}},
    [mlVideos[2].id]: { root: { id: "node_root", label: "Unsupervised Learning", children: [
      { id: "node_1", label: "Clustering", relationship: "technique", is_key_takeaway: true, children: [
        { id: "node_1_1", label: "K-Means", relationship: "algorithm", is_key_takeaway: false, children: [] },
        { id: "node_1_2", label: "DBSCAN", relationship: "algorithm", is_key_takeaway: false, children: [] },
        { id: "node_1_3", label: "Hierarchical", relationship: "algorithm", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_2", label: "Dimensionality Reduction", relationship: "technique", is_key_takeaway: true, children: [
        { id: "node_2_1", label: "PCA", relationship: "algorithm", is_key_takeaway: false, children: [] },
        { id: "node_2_2", label: "t-SNE & UMAP", relationship: "algorithms", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_3", label: "Choosing K", relationship: "challenge", is_key_takeaway: false, children: [
        { id: "node_3_1", label: "Elbow Method", relationship: "solution", is_key_takeaway: false, children: [] },
        { id: "node_3_2", label: "Silhouette Score", relationship: "solution", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_4", label: "Applications", relationship: "used in", is_key_takeaway: false, children: [
        { id: "node_4_1", label: "Customer Segmentation", relationship: "example", is_key_takeaway: false, children: [] },
        { id: "node_4_2", label: "Anomaly Detection", relationship: "example", is_key_takeaway: false, children: [] },
      ]},
    ]}},
    [mlVideos[3].id]: { root: { id: "node_root", label: "Neural Networks & Deep Learning", children: [
      { id: "node_1", label: "Network Structure", relationship: "consists of", is_key_takeaway: true, children: [
        { id: "node_1_1", label: "Input / Hidden / Output Layers", relationship: "components", is_key_takeaway: false, children: [] },
        { id: "node_1_2", label: "Weights & Activation Functions", relationship: "components", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_2", label: "Training Process", relationship: "learned via", is_key_takeaway: true, children: [
        { id: "node_2_1", label: "Forward Propagation", relationship: "step", is_key_takeaway: false, children: [] },
        { id: "node_2_2", label: "Loss Calculation", relationship: "step", is_key_takeaway: false, children: [] },
        { id: "node_2_3", label: "Backpropagation", relationship: "step", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_3", label: "Architectures", relationship: "types", is_key_takeaway: false, children: [
        { id: "node_3_1", label: "CNN (Images)", relationship: "type", is_key_takeaway: false, children: [] },
        { id: "node_3_2", label: "RNN/LSTM (Sequences)", relationship: "type", is_key_takeaway: false, children: [] },
        { id: "node_3_3", label: "Transformers (NLP)", relationship: "type", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_4", label: "Regularization", relationship: "prevents overfitting", is_key_takeaway: false, children: [
        { id: "node_4_1", label: "Dropout", relationship: "technique", is_key_takeaway: false, children: [] },
        { id: "node_4_2", label: "Batch Normalization", relationship: "technique", is_key_takeaway: false, children: [] },
      ]},
    ]}},
    [webVideos[0].id]: { root: { id: "node_root", label: "HTML Document Structure", children: [
      { id: "node_1", label: "Document Skeleton", relationship: "consists of", is_key_takeaway: true, children: [
        { id: "node_1_1", label: "DOCTYPE + <html>", relationship: "wrapper", is_key_takeaway: false, children: [] },
        { id: "node_1_2", label: "<head> (Metadata)", relationship: "section", is_key_takeaway: false, children: [] },
        { id: "node_1_3", label: "<body> (Content)", relationship: "section", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_2", label: "Semantic Elements", relationship: "best practice", is_key_takeaway: true, children: [
        { id: "node_2_1", label: "header, nav, main, footer", relationship: "page-level", is_key_takeaway: false, children: [] },
        { id: "node_2_2", label: "article, section, aside", relationship: "content-level", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_3", label: "Content Elements", relationship: "includes", is_key_takeaway: false, children: [
        { id: "node_3_1", label: "Headings, Paragraphs, Lists", relationship: "text", is_key_takeaway: false, children: [] },
        { id: "node_3_2", label: "Links, Images, Forms", relationship: "interactive", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_4", label: "Accessibility", relationship: "improved by", is_key_takeaway: false, children: [
        { id: "node_4_1", label: "Alt Text", relationship: "technique", is_key_takeaway: false, children: [] },
        { id: "node_4_2", label: "Semantic Markup", relationship: "technique", is_key_takeaway: false, children: [] },
      ]},
    ]}},
    [webVideos[1].id]: { root: { id: "node_root", label: "CSS & Visual Design", children: [
      { id: "node_1", label: "The Cascade", relationship: "core concept", is_key_takeaway: true, children: [
        { id: "node_1_1", label: "Specificity", relationship: "determines", is_key_takeaway: false, children: [] },
        { id: "node_1_2", label: "Source Order", relationship: "determines", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_2", label: "Layout Systems", relationship: "core concept", is_key_takeaway: true, children: [
        { id: "node_2_1", label: "Flexbox (1D)", relationship: "system", is_key_takeaway: false, children: [] },
        { id: "node_2_2", label: "Grid (2D)", relationship: "system", is_key_takeaway: false, children: [] },
        { id: "node_2_3", label: "Component vs. Page Level", relationship: "guidance", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_3", label: "Responsive Design", relationship: "technique", is_key_takeaway: false, children: [
        { id: "node_3_1", label: "Media Queries", relationship: "tool", is_key_takeaway: false, children: [] },
        { id: "node_3_2", label: "Mobile-First Approach", relationship: "strategy", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_4", label: "Modern Features", relationship: "includes", is_key_takeaway: false, children: [
        { id: "node_4_1", label: "Custom Properties (--vars)", relationship: "feature", is_key_takeaway: false, children: [] },
        { id: "node_4_2", label: "Transitions & Animations", relationship: "feature", is_key_takeaway: false, children: [] },
      ]},
    ]}},
    [webVideos[2].id]: { root: { id: "node_root", label: "JavaScript Essentials", children: [
      { id: "node_1", label: "Variables & Types", relationship: "fundamentals", is_key_takeaway: true, children: [
        { id: "node_1_1", label: "const / let (not var)", relationship: "declarations", is_key_takeaway: false, children: [] },
        { id: "node_1_2", label: "Primitives & Objects", relationship: "type system", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_2", label: "DOM Manipulation", relationship: "core skill", is_key_takeaway: true, children: [
        { id: "node_2_1", label: "querySelector / querySelectorAll", relationship: "query", is_key_takeaway: false, children: [] },
        { id: "node_2_2", label: "Event Listeners", relationship: "interaction", is_key_takeaway: false, children: [] },
        { id: "node_2_3", label: "Create / Modify Elements", relationship: "mutation", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_3", label: "Functions", relationship: "building block", is_key_takeaway: false, children: [
        { id: "node_3_1", label: "Arrow Functions", relationship: "syntax", is_key_takeaway: false, children: [] },
        { id: "node_3_2", label: "First-Class Citizens", relationship: "concept", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_4", label: "Async Programming", relationship: "pattern", is_key_takeaway: false, children: [
        { id: "node_4_1", label: "Promises", relationship: "mechanism", is_key_takeaway: false, children: [] },
        { id: "node_4_2", label: "async / await", relationship: "syntax", is_key_takeaway: false, children: [] },
      ]},
    ]}},
    [dsaVideos[0].id]: { root: { id: "node_root", label: "Arrays, Stacks & Queues", children: [
      { id: "node_1", label: "Arrays", relationship: "data structure", is_key_takeaway: true, children: [
        { id: "node_1_1", label: "O(1) Random Access", relationship: "strength", is_key_takeaway: false, children: [] },
        { id: "node_1_2", label: "O(n) Insert / Delete", relationship: "weakness", is_key_takeaway: false, children: [] },
        { id: "node_1_3", label: "Dynamic Resizing", relationship: "variant", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_2", label: "Stacks (LIFO)", relationship: "data structure", is_key_takeaway: true, children: [
        { id: "node_2_1", label: "Push / Pop / Peek", relationship: "operations", is_key_takeaway: false, children: [] },
        { id: "node_2_2", label: "Call Stack & Undo", relationship: "applications", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_3", label: "Queues (FIFO)", relationship: "data structure", is_key_takeaway: false, children: [
        { id: "node_3_1", label: "Enqueue / Dequeue", relationship: "operations", is_key_takeaway: false, children: [] },
        { id: "node_3_2", label: "BFS & Scheduling", relationship: "applications", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_4", label: "Priority Queues", relationship: "extension", is_key_takeaway: false, children: [
        { id: "node_4_1", label: "Binary Heap", relationship: "implementation", is_key_takeaway: false, children: [] },
        { id: "node_4_2", label: "O(log n) Operations", relationship: "performance", is_key_takeaway: false, children: [] },
      ]},
    ]}},
    [dsaVideos[1].id]: { root: { id: "node_root", label: "Trees & Graphs", children: [
      { id: "node_1", label: "Binary Search Trees", relationship: "tree type", is_key_takeaway: true, children: [
        { id: "node_1_1", label: "Left < Root < Right", relationship: "property", is_key_takeaway: false, children: [] },
        { id: "node_1_2", label: "O(log n) When Balanced", relationship: "performance", is_key_takeaway: false, children: [] },
        { id: "node_1_3", label: "AVL / Red-Black Trees", relationship: "self-balancing", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_2", label: "Tree Traversals", relationship: "operations", is_key_takeaway: true, children: [
        { id: "node_2_1", label: "In-Order (Sorted)", relationship: "type", is_key_takeaway: false, children: [] },
        { id: "node_2_2", label: "Pre-Order / Post-Order", relationship: "types", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_3", label: "Graph Representation", relationship: "concept", is_key_takeaway: false, children: [
        { id: "node_3_1", label: "Adjacency List", relationship: "method", is_key_takeaway: false, children: [] },
        { id: "node_3_2", label: "Adjacency Matrix", relationship: "method", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_4", label: "Graph Traversals", relationship: "algorithms", is_key_takeaway: false, children: [
        { id: "node_4_1", label: "BFS (Queue)", relationship: "algorithm", is_key_takeaway: false, children: [] },
        { id: "node_4_2", label: "DFS (Stack)", relationship: "algorithm", is_key_takeaway: false, children: [] },
      ]},
    ]}},
    [dsaVideos[2].id]: { root: { id: "node_root", label: "Sorting & Searching", children: [
      { id: "node_1", label: "O(n²) Sorts", relationship: "simple", is_key_takeaway: false, children: [
        { id: "node_1_1", label: "Bubble Sort", relationship: "algorithm", is_key_takeaway: false, children: [] },
        { id: "node_1_2", label: "Selection Sort", relationship: "algorithm", is_key_takeaway: false, children: [] },
        { id: "node_1_3", label: "Insertion Sort", relationship: "algorithm", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_2", label: "O(n log n) Sorts", relationship: "efficient", is_key_takeaway: true, children: [
        { id: "node_2_1", label: "Merge Sort", relationship: "algorithm", is_key_takeaway: false, children: [] },
        { id: "node_2_2", label: "Quick Sort", relationship: "algorithm", is_key_takeaway: false, children: [] },
        { id: "node_2_3", label: "Heap Sort", relationship: "algorithm", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_3", label: "Searching", relationship: "technique", is_key_takeaway: true, children: [
        { id: "node_3_1", label: "Binary Search O(log n)", relationship: "algorithm", is_key_takeaway: false, children: [] },
        { id: "node_3_2", label: "Hash Table O(1)", relationship: "data structure", is_key_takeaway: false, children: [] },
      ]},
      { id: "node_4", label: "Complexity Analysis", relationship: "framework", is_key_takeaway: false, children: [
        { id: "node_4_1", label: "Big-O Notation", relationship: "tool", is_key_takeaway: false, children: [] },
        { id: "node_4_2", label: "Time vs. Space Trade-off", relationship: "concept", is_key_takeaway: false, children: [] },
      ]},
    ]}},
  };

  for (const video of allVideos) {
    await db.insert(learningContent).values({
      videoId: video.id,
      contentType: "mental_map",
      content: mentalMapData[video.id],
    });
  }

  // ── Tests ──────────────────────────────────────────────

  const testData: Record<string, object> = {};

  for (const video of allVideos) {
    const prefix = video.id.slice(0, 8);
    testData[video.id] = {
      test_title: `${video.title} Assessment`,
      time_limit_minutes: 30,
      passing_score_percent: 70,
      questions: [
        { id: `t_${prefix}_mcq1`, type: "mcq", question: `Which concept is central to "${video.title}"?`, options: { A: "It is only theoretical with no applications", B: "It involves a systematic approach to problem-solving in this domain", C: "It requires no prior knowledge", D: "It was invented in the 21st century" }, correct_answer: "B", points: 1, difficulty: "easy" },
        { id: `t_${prefix}_mcq2`, type: "mcq", question: `What is the primary benefit of studying ${video.title.toLowerCase()}?`, options: { A: "Memorizing formulas", B: "Understanding foundational principles for real-world problem solving", C: "Passing standardized tests only", D: "Replacing professional expertise" }, correct_answer: "B", points: 1, difficulty: "medium" },
        { id: `t_${prefix}_mcq3`, type: "mcq", question: `In the context of this lesson, which statement is most accurate?`, options: { A: "Theory and practice are unrelated", B: "Foundational concepts enable advanced applications", C: "Only advanced topics matter", D: "Complexity is always undesirable" }, correct_answer: "B", points: 1, difficulty: "medium" },
        { id: `t_${prefix}_mcq4`, type: "mcq", question: `Which is NOT a key topic covered in "${video.title}"?`, options: { A: "Core definitions and terminology", B: "Practical examples and applications", C: "Unrelated historical trivia", D: "Problem-solving strategies" }, correct_answer: "C", points: 1, difficulty: "easy" },
        { id: `t_${prefix}_tf1`, type: "true_false", question: `The topics covered in "${video.title}" have practical applications in industry.`, correct_answer: "true", points: 1 },
        { id: `t_${prefix}_tf2`, type: "true_false", question: `Understanding the fundamentals covered in this lesson is unnecessary for advanced study.`, correct_answer: "false", points: 1 },
        { id: `t_${prefix}_sa1`, type: "short_answer", question: `In your own words, explain the most important concept from "${video.title}" and why it matters.`, correct_answer: `A clear explanation of the core concept from ${video.title} with reasoning about its significance.`, points: 1 },
        { id: `t_${prefix}_sa2`, type: "short_answer", question: `Describe one real-world application of the concepts taught in "${video.title}".`, correct_answer: `A specific, relevant real-world application demonstrating understanding of ${video.title}.`, points: 1 },
      ],
    };
  }

  for (const video of allVideos) {
    await db.insert(learningContent).values({
      videoId: video.id,
      contentType: "test",
      content: testData[video.id],
    });
  }

  // ── Enrollment + Progress ──────────────────────────────

  await db.insert(enrollments).values({
    userId: studentUser.id,
    courseId: mlCourse.id,
  });

  // Video 1: completed
  await db.insert(progress).values({
    userId: studentUser.id,
    videoId: mlVideos[0].id,
    progressType: "video",
    data: { watched_sec: 720, last_position: 720, completed: true },
  });

  // Video 2: 60% watched
  await db.insert(progress).values({
    userId: studentUser.id,
    videoId: mlVideos[1].id,
    progressType: "video",
    data: { watched_sec: 540, last_position: 540, completed: false },
  });

  // Quiz 1: 80%
  const mlQuiz = await db.query.learningContent.findFirst({
    where: and(
      eq(learningContent.videoId, mlVideos[0].id),
      eq(learningContent.contentType, "quiz"),
    ),
  });

  if (mlQuiz) {
    await db.insert(progress).values({
      userId: studentUser.id,
      contentId: mlQuiz.id,
      progressType: "quiz",
      data: {
        answers: { q_ml1_1: "B", q_ml1_2: "C", q_ml1_3: "B", q_ml1_4: "B", q_ml1_5: "A" },
        score_percent: 80,
        passed: true,
        time_spent_sec: 120,
      },
    });
  }

  // 3 flashcard reviews
  const mlFlashcards = await db.query.learningContent.findFirst({
    where: and(
      eq(learningContent.videoId, mlVideos[0].id),
      eq(learningContent.contentType, "flashcards"),
    ),
  });

  if (mlFlashcards) {
    await db.insert(progress).values([
      { userId: studentUser.id, contentId: mlFlashcards.id, progressType: "flashcard", data: { card_id: "fc_ml1_1", rating: 2 } },
      { userId: studentUser.id, contentId: mlFlashcards.id, progressType: "flashcard", data: { card_id: "fc_ml1_2", rating: 4 } },
      { userId: studentUser.id, contentId: mlFlashcards.id, progressType: "flashcard", data: { card_id: "fc_ml1_3", rating: 3 } },
    ]);
  }

  console.log("Seed complete!");
  console.log("  Users: 2 (admin + student)");
  console.log("  Courses: 3");
  console.log(`  Videos: ${allVideos.length}`);
  console.log(`  Learning content: ${allVideos.length * 4} (4 types per video)`);
  console.log("  Enrollments: 1");
  console.log("  Progress entries: 6");

  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

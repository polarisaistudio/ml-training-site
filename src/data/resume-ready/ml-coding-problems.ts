// src/data/resume-ready/ml-coding-problems.ts

export type ProblemDifficulty = "easy" | "medium" | "hard";
export type ProblemCategory =
  | "ml-algorithms"
  | "neural-networks"
  | "data-processing"
  | "optimization"
  | "evaluation-metrics";

export interface TestCase {
  input: unknown;
  expectedOutput: unknown;
  explanation?: string;
}

export interface ProgressiveHint {
  level: number; // 1-5, unlock sequentially
  hint: string;
  codeSnippet?: string; // Optional code hint
}

export interface MLCodingProblem {
  id: string;
  title: string;
  category: ProblemCategory;
  difficulty: ProblemDifficulty;
  estimatedTime: string; // e.g., "30-45 minutes"

  // Problem statement
  description: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];

  // Function signature
  functionSignature: {
    python: string;
    // Can add other languages later
  };

  // Hints (unlock progressively)
  hints: ProgressiveHint[];

  // Test cases (some visible, some hidden)
  testCases: {
    visible: TestCase[];
    hidden: TestCase[];
  };

  // Solution approach (only shown after completion)
  solutionApproach: {
    intuition: string;
    algorithm: string;
    complexity: {
      time: string;
      space: string;
    };
    keyInsights: string[];
  };

  // Complete solution (only shown after attempt)
  solution: {
    python: string;
    explanation: string;
  };

  // Follow-up questions
  followUps?: string[];

  // Related concepts
  relatedConcepts: string[];
  tags: string[];
}

export const ML_CODING_PROBLEMS: MLCodingProblem[] = [
  // ============================================================================
  // PROBLEM 1: K-Means Clustering from Scratch
  // ============================================================================

  {
    id: "ml-algo-01",
    title: "Implement K-Means Clustering",
    category: "ml-algorithms",
    difficulty: "medium",
    estimatedTime: "35-45 minutes",

    description: `
Implement the K-Means clustering algorithm from scratch. Given a dataset of points and a number k, partition the points into k clusters by iteratively:

1. Assigning each point to the nearest centroid
2. Updating centroids to be the mean of assigned points
3. Repeating until convergence (centroids don't change significantly)

Your implementation should handle 2D points but be extensible to higher dimensions.
    `,

    constraints: [
      "Number of points n: 10 ≤ n ≤ 1000",
      "Number of clusters k: 2 ≤ k ≤ 10",
      "Points are in 2D space (can extend to n-dimensional)",
      "Use Euclidean distance",
      "Maximum 100 iterations or convergence threshold 1e-4",
    ],

    examples: [
      {
        input: `
points = [[1, 2], [1, 4], [1, 0], [10, 2], [10, 4], [10, 0]]
k = 2
        `,
        output: `
# After convergence:
centroids = [[1.0, 2.0], [10.0, 2.0]]
labels = [0, 0, 0, 1, 1, 1]
# Points [1,2], [1,4], [1,0] in cluster 0
# Points [10,2], [10,4], [10,0] in cluster 1
        `,
        explanation:
          "Two clear clusters: points around x=1 and points around x=10",
      },
      {
        input: `
points = [[0, 0], [1, 1], [5, 5], [6, 6]]
k = 2
        `,
        output: `
centroids = [[0.5, 0.5], [5.5, 5.5]]
labels = [0, 0, 1, 1]
        `,
      },
    ],

    functionSignature: {
      python: `
def kmeans(points: List[List[float]], k: int, max_iters: int = 100) -> Tuple[List[List[float]], List[int]]:
    """
    Implement K-Means clustering.

    Args:
        points: List of points, each point is [x, y, ...]
        k: Number of clusters
        max_iters: Maximum iterations

    Returns:
        centroids: List of k centroid coordinates
        labels: Cluster assignment for each point (0 to k-1)
    """
    pass
      `,
    },

    hints: [
      {
        level: 1,
        hint: "Start by randomly initializing k centroids. You can pick k random points from the dataset as initial centroids.",
      },
      {
        level: 2,
        hint: "For each iteration: (1) Assign each point to nearest centroid by computing Euclidean distance to all centroids, (2) Update each centroid to be the mean of points assigned to it.",
        codeSnippet: `
# Euclidean distance between two points
def euclidean_distance(p1, p2):
    return sum((a - b) ** 2 for a, b in zip(p1, p2)) ** 0.5
        `,
      },
      {
        level: 3,
        hint: "Check for convergence: if centroids change by less than a threshold (e.g., 1e-4) or max iterations reached, stop.",
        codeSnippet: `
# Check if centroids have converged
def has_converged(old_centroids, new_centroids, threshold=1e-4):
    for old, new in zip(old_centroids, new_centroids):
        if euclidean_distance(old, new) > threshold:
            return False
    return True
        `,
      },
      {
        level: 4,
        hint: "Use numpy for efficient computation. Points can be a numpy array of shape (n, d) where n is number of points and d is dimensionality.",
        codeSnippet: `
import numpy as np

# Compute distances from all points to all centroids
# Broadcasting: (n, d) - (k, d) -> (n, k) distances
distances = np.linalg.norm(points[:, np.newaxis] - centroids, axis=2)

# Assign each point to nearest centroid
labels = np.argmin(distances, axis=1)
        `,
      },
      {
        level: 5,
        hint: "Edge case: If a cluster becomes empty (no points assigned), reinitialize that centroid to a random point.",
      },
    ],

    testCases: {
      visible: [
        {
          input: {
            points: [
              [1, 2],
              [1, 4],
              [1, 0],
              [10, 2],
              [10, 4],
              [10, 0],
            ],
            k: 2,
          },
          expectedOutput: {
            centroids: [
              [1.0, 2.0],
              [10.0, 2.0],
            ],
            labels: [0, 0, 0, 1, 1, 1],
          },
          explanation: "Two well-separated clusters",
        },
        {
          input: {
            points: [
              [0, 0],
              [1, 1],
              [5, 5],
              [6, 6],
            ],
            k: 2,
          },
          expectedOutput: {
            centroids: [
              [0.5, 0.5],
              [5.5, 5.5],
            ],
            labels: [0, 0, 1, 1],
          },
        },
      ],
      hidden: [
        {
          input: {
            points: [
              [1, 1],
              [2, 2],
              [3, 3],
              [10, 10],
              [11, 11],
              [12, 12],
            ],
            k: 2,
          },
          expectedOutput: {
            centroids: [
              [2.0, 2.0],
              [11.0, 11.0],
            ],
            labels: [0, 0, 0, 1, 1, 1],
          },
        },
        {
          input: {
            points: [
              [0, 0],
              [1, 0],
              [0, 1],
              [10, 10],
              [11, 10],
              [10, 11],
            ],
            k: 2,
          },
          expectedOutput: {
            centroids: [
              [0.33, 0.33],
              [10.33, 10.33],
            ],
            labels: [0, 0, 0, 1, 1, 1],
          },
          explanation: "Approximate centroids due to floating point",
        },
      ],
    },

    solutionApproach: {
      intuition:
        "K-Means is an iterative algorithm that alternates between two steps: (1) Assign each point to the nearest centroid (hard assignment), (2) Update centroids to be the mean of assigned points. This process minimizes within-cluster variance.",

      algorithm: `
1. Initialize k centroids (random points from dataset)
2. Repeat until convergence:
   a. Assign each point to nearest centroid (compute all distances)
   b. Update each centroid to mean of assigned points
   c. Check if centroids changed < threshold
3. Return final centroids and labels
      `,

      complexity: {
        time: "O(n * k * d * i) where n=points, k=clusters, d=dimensions, i=iterations",
        space: "O(n + k*d) for storing points and centroids",
      },

      keyInsights: [
        "K-Means finds local optima, not global. Different initializations give different results.",
        "Use K-Means++ initialization for better starting centroids",
        "Empty clusters can occur—handle by reinitializing that centroid",
        "Euclidean distance assumes all features have similar scales—normalize data first",
        "K-Means assumes spherical clusters—doesn't work well for elongated or irregular shapes",
      ],
    },

    solution: {
      python: `
import numpy as np
from typing import List, Tuple

def kmeans(points: List[List[float]], k: int, max_iters: int = 100) -> Tuple[List[List[float]], List[int]]:
    """
    Implement K-Means clustering.
    """
    # Convert to numpy array for efficient computation
    points = np.array(points)
    n, d = points.shape

    # Initialize centroids: pick k random points
    np.random.seed(42)  # For reproducibility in testing
    indices = np.random.choice(n, k, replace=False)
    centroids = points[indices].copy()

    for iteration in range(max_iters):
        # Step 1: Assign each point to nearest centroid
        # Compute distances from all points to all centroids
        # Shape: (n, k) where entry [i,j] is distance from point i to centroid j
        distances = np.linalg.norm(points[:, np.newaxis] - centroids, axis=2)

        # Assign each point to nearest centroid
        labels = np.argmin(distances, axis=1)

        # Step 2: Update centroids
        new_centroids = np.zeros_like(centroids)
        for i in range(k):
            # Points assigned to cluster i
            cluster_points = points[labels == i]

            if len(cluster_points) > 0:
                # Update centroid to mean of assigned points
                new_centroids[i] = cluster_points.mean(axis=0)
            else:
                # Empty cluster: reinitialize to random point
                new_centroids[i] = points[np.random.choice(n)]

        # Check convergence: if centroids don't change much, stop
        if np.allclose(centroids, new_centroids, atol=1e-4):
            centroids = new_centroids
            break

        centroids = new_centroids

    # Convert back to lists for return
    return centroids.tolist(), labels.tolist()
      `,

      explanation: `
**Key Implementation Details:**

1. **Initialization**: We use k random points from the dataset as initial centroids. In practice, K-Means++ is better but more complex.

2. **Distance Computation**: We use numpy broadcasting to efficiently compute distances from all points to all centroids in one operation:
   - points[:, np.newaxis] has shape (n, 1, d)
   - centroids has shape (k, d)
   - Broadcasting gives (n, k, d) differences
   - np.linalg.norm with axis=2 gives (n, k) distances

3. **Assignment**: argmin finds the index of nearest centroid for each point.

4. **Update**: For each cluster, compute mean of assigned points. Handle empty clusters by reinitializing to a random point.

5. **Convergence**: Check if centroids change less than threshold (1e-4). This is more robust than checking if labels don't change.

**Complexity Analysis:**
- Time: O(n * k * d * i) where i is number of iterations (typically small, ~10-30)
- Space: O(n * k) for distance matrix (can be optimized to O(n))

**Common Pitfalls:**
- Forgetting to handle empty clusters
- Not checking convergence (running all max_iters unnecessarily)
- Using wrong distance metric or not normalizing data
- Integer overflow if using sum of squared distances without sqrt
      `,
    },

    followUps: [
      "How would you implement K-Means++ initialization?",
      "How would you choose the optimal k?",
      "What if clusters have different sizes or densities?",
      "How would you parallelize K-Means for large datasets?",
      "What are the limitations of K-Means? When would you use other clustering algorithms?",
    ],

    relatedConcepts: [
      "Unsupervised Learning",
      "Clustering",
      "Distance Metrics",
      "Optimization",
      "Lloyd's Algorithm",
    ],

    tags: ["clustering", "unsupervised", "classic-ml", "numpy", "optimization"],
  },

  // ============================================================================
  // PROBLEM 2: Linear Regression from Scratch
  // ============================================================================

  {
    id: "ml-algo-02",
    title: "Implement Linear Regression with Gradient Descent",
    category: "ml-algorithms",
    difficulty: "medium",
    estimatedTime: "30-40 minutes",

    description: `
Implement linear regression from scratch using gradient descent. Given training data (X, y), learn weights that minimize mean squared error.

Your implementation should:
1. Initialize weights randomly
2. Compute predictions: y_pred = X * w
3. Compute loss: MSE = mean((y_pred - y)^2)
4. Update weights using gradient descent: w = w - learning_rate * gradient
5. Repeat until convergence or max iterations

Include both the training function and prediction function.
    `,

    constraints: [
      "Number of samples n: 10 ≤ n ≤ 10000",
      "Number of features d: 1 ≤ d ≤ 100",
      "Learning rate: 0.001 ≤ lr ≤ 0.1",
      "Max iterations: 1000",
      "Convergence threshold: 1e-6 for loss change",
    ],

    examples: [
      {
        input: `
# Simple 1D case: y = 2x + 1
X = [[1], [2], [3], [4], [5]]
y = [3, 5, 7, 9, 11]
learning_rate = 0.01
        `,
        output: `
# After training:
weights ≈ [2.0]
bias ≈ 1.0
# Predictions: [3, 5, 7, 9, 11]
        `,
        explanation: "Perfect linear relationship: y = 2x + 1",
      },
      {
        input: `
# 2D case with some noise
X = [[1, 2], [2, 3], [3, 4], [4, 5]]
y = [5, 7, 9, 11]
        `,
        output: `
# After training:
weights ≈ [1.0, 1.0]
bias ≈ 1.0
        `,
      },
    ],

    functionSignature: {
      python: `
class LinearRegression:
    def __init__(self, learning_rate: float = 0.01, max_iters: int = 1000):
        """
        Initialize linear regression model.

        Args:
            learning_rate: Step size for gradient descent
            max_iters: Maximum training iterations
        """
        self.lr = learning_rate
        self.max_iters = max_iters
        self.weights = None
        self.bias = None

    def fit(self, X: np.ndarray, y: np.ndarray) -> None:
        """
        Train the model using gradient descent.

        Args:
            X: Training features, shape (n_samples, n_features)
            y: Training labels, shape (n_samples,)
        """
        pass

    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Make predictions on new data.

        Args:
            X: Features, shape (n_samples, n_features)

        Returns:
            predictions: shape (n_samples,)
        """
        pass
      `,
    },

    hints: [
      {
        level: 1,
        hint: "Linear regression model: y_pred = X * w + b. Initialize weights w randomly (small values like N(0, 0.01)) and bias b to 0.",
      },
      {
        level: 2,
        hint: "Loss function is Mean Squared Error: MSE = (1/n) * sum((y_pred - y)^2)",
        codeSnippet: `
def compute_loss(y_true, y_pred):
    return np.mean((y_pred - y_true) ** 2)
        `,
      },
      {
        level: 3,
        hint: "Gradients for gradient descent: dw = (2/n) * X.T * (y_pred - y), db = (2/n) * sum(y_pred - y)",
        codeSnippet: `
# Compute predictions
y_pred = X.dot(self.weights) + self.bias

# Compute gradients
n = X.shape[0]
dw = (2/n) * X.T.dot(y_pred - y)
db = (2/n) * np.sum(y_pred - y)

# Update weights
self.weights -= self.lr * dw
self.bias -= self.lr * db
        `,
      },
      {
        level: 4,
        hint: "Track loss over iterations to check convergence. Stop if loss change < threshold or after max_iters.",
        codeSnippet: `
losses = []
for i in range(self.max_iters):
    y_pred = X.dot(self.weights) + self.bias
    loss = compute_loss(y, y_pred)
    losses.append(loss)

    # Check convergence
    if i > 0 and abs(losses[-1] - losses[-2]) < 1e-6:
        break

    # Update weights using gradients...
        `,
      },
      {
        level: 5,
        hint: "Consider feature scaling (normalize X) for faster convergence. Also, vectorize all operations using numpy for efficiency.",
      },
    ],

    testCases: {
      visible: [
        {
          input: {
            X: [[1], [2], [3], [4], [5]],
            y: [3, 5, 7, 9, 11],
          },
          expectedOutput: {
            weights: [2.0],
            bias: 1.0,
            predictions: [3.0, 5.0, 7.0, 9.0, 11.0],
          },
          explanation: "Perfect linear fit: y = 2x + 1",
        },
      ],
      hidden: [
        {
          input: {
            X: [
              [1, 2],
              [2, 3],
              [3, 4],
              [4, 5],
            ],
            y: [5, 7, 9, 11],
          },
          expectedOutput: {
            weights: [1.0, 1.0],
            bias: 1.0,
          },
        },
      ],
    },

    solutionApproach: {
      intuition:
        "Linear regression finds the best-fit line (or hyperplane) by minimizing the average squared distance between predictions and actual values. Gradient descent iteratively adjusts weights in the direction that reduces loss.",

      algorithm: `
1. Initialize weights randomly, bias to 0
2. For each iteration:
   a. Compute predictions: y_pred = X * w + b
   b. Compute loss: MSE = mean((y_pred - y)^2)
   c. Compute gradients: dw, db
   d. Update: w = w - lr * dw, b = b - lr * db
   e. Check if loss converged
3. Return trained weights
      `,

      complexity: {
        time: "O(n * d * i) where n=samples, d=features, i=iterations",
        space: "O(d) for storing weights",
      },

      keyInsights: [
        "Gradient descent is first-order optimization—only uses first derivatives",
        "Learning rate is critical: too small = slow convergence, too large = divergence",
        "Feature scaling speeds up convergence significantly",
        "Closed-form solution exists (Normal Equation) but doesn't scale to large datasets",
        "For large datasets, use mini-batch or stochastic gradient descent",
      ],
    },

    solution: {
      python: `
import numpy as np

class LinearRegression:
    def __init__(self, learning_rate: float = 0.01, max_iters: int = 1000):
        self.lr = learning_rate
        self.max_iters = max_iters
        self.weights = None
        self.bias = None
        self.losses = []

    def fit(self, X: np.ndarray, y: np.ndarray) -> None:
        """Train using gradient descent."""
        X = np.array(X)
        y = np.array(y)
        n_samples, n_features = X.shape

        # Initialize weights and bias
        self.weights = np.random.randn(n_features) * 0.01
        self.bias = 0

        # Gradient descent
        for i in range(self.max_iters):
            # Forward pass: compute predictions
            y_pred = X.dot(self.weights) + self.bias

            # Compute loss
            loss = np.mean((y_pred - y) ** 2)
            self.losses.append(loss)

            # Check convergence
            if i > 0 and abs(self.losses[-1] - self.losses[-2]) < 1e-6:
                print(f"Converged after {i} iterations")
                break

            # Compute gradients
            dw = (2 / n_samples) * X.T.dot(y_pred - y)
            db = (2 / n_samples) * np.sum(y_pred - y)

            # Update parameters
            self.weights -= self.lr * dw
            self.bias -= self.lr * db

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Make predictions."""
        X = np.array(X)
        return X.dot(self.weights) + self.bias
      `,

      explanation: `
**Implementation Details:**

1. **Initialization**: Weights initialized to small random values (N(0, 0.01)) to break symmetry. Bias initialized to 0.

2. **Forward Pass**: Compute predictions using matrix multiplication: y_pred = Xw + b. This is vectorized for efficiency.

3. **Loss Computation**: Mean Squared Error (MSE) measures average squared difference between predictions and true values.

4. **Gradients**: Derived from calculus:
   - ∂MSE/∂w = (2/n) * X^T * (y_pred - y)
   - ∂MSE/∂b = (2/n) * sum(y_pred - y)

5. **Update Rule**: Gradient descent moves in direction of negative gradient: w = w - α * ∂MSE/∂w

6. **Convergence**: Stop when loss change < 1e-6 between iterations. This indicates we've reached (local) minimum.

**Why This Works:**
- Gradient points in direction of steepest increase
- Negative gradient points toward minimum
- Learning rate controls step size
- Iteratively, we descend toward minimum loss

**Practical Considerations:**
- Feature scaling speeds convergence
- Learning rate tuning is critical
- Can add L2 regularization: loss + λ||w||²
- For large datasets, use mini-batch gradient descent
      `,
    },

    followUps: [
      "How would you implement L2 regularization (Ridge regression)?",
      "What is the closed-form solution (Normal Equation)?",
      "How would you implement mini-batch gradient descent?",
      "How do you choose learning rate?",
      "When would you use gradient descent vs closed-form solution?",
    ],

    relatedConcepts: [
      "Supervised Learning",
      "Optimization",
      "Gradient Descent",
      "Loss Functions",
      "Regularization",
    ],

    tags: [
      "regression",
      "gradient-descent",
      "optimization",
      "supervised",
      "numpy",
    ],
  },

  // ============================================================================
  // PROBLEM 3: Implement Softmax and Cross-Entropy Loss
  // ============================================================================

  {
    id: "nn-01",
    title: "Implement Softmax and Cross-Entropy Loss",
    category: "neural-networks",
    difficulty: "easy",
    estimatedTime: "20-30 minutes",

    description: `
Implement the softmax activation function and cross-entropy loss for multi-class classification.

**Softmax**: Converts logits (raw scores) into probabilities that sum to 1.
Formula: softmax(x_i) = exp(x_i) / sum(exp(x_j)) for all j

**Cross-Entropy Loss**: Measures difference between predicted probabilities and true labels.
Formula: -sum(y_true * log(y_pred))

Your implementation should:
1. Handle numerical stability (prevent overflow in exp)
2. Work with batched inputs (multiple samples)
3. Support both one-hot encoded and integer labels
    `,

    constraints: [
      "Batch size: 1 ≤ batch_size ≤ 1000",
      "Number of classes: 2 ≤ num_classes ≤ 1000",
      "Logits are float values (can be negative)",
      "Labels are either one-hot vectors or integers",
    ],

    examples: [
      {
        input: `
# Single sample, 3 classes
logits = [2.0, 1.0, 0.1]
        `,
        output: `
probabilities = [0.659, 0.242, 0.099]
# Sum = 1.0
        `,
        explanation: "Softmax converts scores to probabilities",
      },
      {
        input: `
# Cross-entropy loss
y_pred = [0.7, 0.2, 0.1]  # Predicted probabilities
y_true = [1, 0, 0]         # True label is class 0
        `,
        output: `
loss = -log(0.7) = 0.357
        `,
        explanation: "Loss is negative log probability of correct class",
      },
    ],

    functionSignature: {
      python: `
def softmax(logits: np.ndarray) -> np.ndarray:
    """
    Compute softmax probabilities.

    Args:
        logits: Raw scores, shape (batch_size, num_classes) or (num_classes,)

    Returns:
        probabilities: Same shape as logits, values sum to 1 along last axis
    """
    pass

def cross_entropy_loss(y_pred: np.ndarray, y_true: np.ndarray) -> float:
    """
    Compute cross-entropy loss.

    Args:
        y_pred: Predicted probabilities, shape (batch_size, num_classes)
        y_true: True labels, either:
                - One-hot encoded: shape (batch_size, num_classes)
                - Integer labels: shape (batch_size,)

    Returns:
        loss: Average cross-entropy loss (scalar)
    """
    pass
      `,
    },

    hints: [
      {
        level: 1,
        hint: "For numerical stability, subtract max(logits) before computing exp. This prevents overflow without changing the result.",
        codeSnippet: `
# Numerical stability trick
logits = logits - np.max(logits, axis=-1, keepdims=True)
exp_logits = np.exp(logits)
probabilities = exp_logits / np.sum(exp_logits, axis=-1, keepdims=True)
        `,
      },
      {
        level: 2,
        hint: "For cross-entropy, if labels are integers, convert to one-hot encoding first. Use np.eye(num_classes)[labels] for conversion.",
      },
      {
        level: 3,
        hint: "Add small epsilon (1e-15) to predicted probabilities before taking log to prevent log(0) = -inf.",
        codeSnippet: `
epsilon = 1e-15
y_pred_clipped = np.clip(y_pred, epsilon, 1 - epsilon)
loss = -np.sum(y_true * np.log(y_pred_clipped)) / batch_size
        `,
      },
      {
        level: 4,
        hint: "Remember to average the loss over the batch. Sum the loss for all samples and divide by batch size.",
      },
    ],

    testCases: {
      visible: [
        {
          input: {
            logits: [2.0, 1.0, 0.1],
            type: "softmax",
          },
          expectedOutput: [0.659, 0.242, 0.099],
          explanation: "Single sample softmax",
        },
        {
          input: {
            y_pred: [
              [0.7, 0.2, 0.1],
              [0.1, 0.8, 0.1],
            ],
            y_true: [0, 1],
            type: "cross_entropy",
          },
          expectedOutput: 0.268,
          explanation: "Batch of 2 samples, integer labels",
        },
      ],
      hidden: [
        {
          input: {
            logits: [[1000, 2000, 3000]], // Large values test numerical stability
            type: "softmax",
          },
          expectedOutput: [[0.0, 0.0, 1.0]],
        },
      ],
    },

    solutionApproach: {
      intuition:
        "Softmax squashes logits into valid probability distribution (positive values summing to 1). Cross-entropy measures how different predicted distribution is from true distribution—lower is better.",

      algorithm: `
Softmax:
1. Subtract max for numerical stability
2. Compute exp(logits)
3. Normalize by sum

Cross-Entropy:
1. Convert integer labels to one-hot if needed
2. Compute element-wise: -y_true * log(y_pred)
3. Sum and average over batch
      `,

      complexity: {
        time: "O(batch_size * num_classes) for both functions",
        space: "O(batch_size * num_classes) for storing probabilities",
      },

      keyInsights: [
        "Softmax + cross-entropy are standard for multi-class classification",
        "Numerical stability is critical—always subtract max before exp",
        "Cross-entropy penalizes confident wrong predictions more",
        "Softmax is monotonic—relative order of logits preserved",
        "Combined softmax + cross-entropy has simple gradient: y_pred - y_true",
      ],
    },

    solution: {
      python: `
import numpy as np

def softmax(logits: np.ndarray) -> np.ndarray:
    """Numerically stable softmax."""
    # Handle both 1D and 2D inputs
    if logits.ndim == 1:
        logits = logits.reshape(1, -1)

    # Numerical stability: subtract max
    logits = logits - np.max(logits, axis=-1, keepdims=True)

    # Compute softmax
    exp_logits = np.exp(logits)
    probabilities = exp_logits / np.sum(exp_logits, axis=-1, keepdims=True)

    return probabilities

def cross_entropy_loss(y_pred: np.ndarray, y_true: np.ndarray) -> float:
    """Cross-entropy loss with support for integer labels."""
    batch_size = y_pred.shape[0]

    # Convert integer labels to one-hot if needed
    if y_true.ndim == 1:
        num_classes = y_pred.shape[1]
        y_true_one_hot = np.eye(num_classes)[y_true]
    else:
        y_true_one_hot = y_true

    # Clip predictions to prevent log(0)
    epsilon = 1e-15
    y_pred_clipped = np.clip(y_pred, epsilon, 1 - epsilon)

    # Compute cross-entropy
    # -sum(y_true * log(y_pred)) for each sample, then average
    loss = -np.sum(y_true_one_hot * np.log(y_pred_clipped)) / batch_size

    return loss
      `,

      explanation: `
**Softmax Implementation:**

1. **Numerical Stability**: Subtracting max(logits) prevents exp(large_number) = overflow. This works because:
   softmax(x) = softmax(x + c) for any constant c

   Proof: exp(x_i + c) / sum(exp(x_j + c))
        = exp(c) * exp(x_i) / (exp(c) * sum(exp(x_j)))
        = exp(x_i) / sum(exp(x_j))

2. **Vectorization**: Use broadcasting for batch processing. keepdims=True ensures correct shape for division.

**Cross-Entropy Implementation:**

1. **Label Conversion**: If labels are integers [0, 1, 0], convert to one-hot [[1,0,0], [0,1,0], [1,0,0]] using np.eye indexing.

2. **Numerical Stability**: Clip predictions to [epsilon, 1-epsilon] to prevent log(0) = -inf and log(1) = 0 issues.

3. **Loss Computation**: Element-wise multiply y_true * log(y_pred), sum, divide by batch size.

**Why Cross-Entropy:**
- Penalizes confident wrong predictions heavily
- Gradient w.r.t logits is simple: y_pred - y_true
- Probabilistic interpretation: KL divergence from true to predicted distribution
      `,
    },

    followUps: [
      "What is the gradient of softmax + cross-entropy w.r.t logits?",
      "Why use cross-entropy instead of MSE for classification?",
      "How would you implement log-softmax for better numerical stability?",
      "What is label smoothing and why is it useful?",
      "How does cross-entropy relate to maximum likelihood estimation?",
    ],

    relatedConcepts: [
      "Neural Networks",
      "Activation Functions",
      "Loss Functions",
      "Classification",
      "Backpropagation",
    ],

    tags: [
      "neural-networks",
      "classification",
      "loss-functions",
      "numpy",
      "easy",
    ],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getProblemsByDifficulty = (
  difficulty: ProblemDifficulty
): MLCodingProblem[] => {
  return ML_CODING_PROBLEMS.filter((p) => p.difficulty === difficulty);
};

export const getProblemsByCategory = (
  category: ProblemCategory
): MLCodingProblem[] => {
  return ML_CODING_PROBLEMS.filter((p) => p.category === category);
};

export const getProblemById = (id: string): MLCodingProblem | undefined => {
  return ML_CODING_PROBLEMS.find((p) => p.id === id);
};

export const getEasyProblems = (): MLCodingProblem[] => {
  return getProblemsByDifficulty("easy");
};

// ============================================================================
// METADATA
// ============================================================================

export const PROBLEM_CATEGORIES_META = [
  {
    id: "ml-algorithms" as const,
    name: "ML Algorithms",
    icon: "🤖",
    description: "Implement classic ML algorithms from scratch",
  },
  {
    id: "neural-networks" as const,
    name: "Neural Networks",
    icon: "🧠",
    description: "Build neural network components and training",
  },
  {
    id: "data-processing" as const,
    name: "Data Processing",
    icon: "📊",
    description: "Data preparation, transformation, and feature engineering",
  },
  {
    id: "optimization" as const,
    name: "Optimization",
    icon: "⚡",
    description: "Gradient descent variants and optimization techniques",
  },
  {
    id: "evaluation-metrics" as const,
    name: "Evaluation Metrics",
    icon: "📈",
    description: "Implement metrics for model evaluation",
  },
];

export const DIFFICULTY_LABELS = {
  easy: {
    label: "Easy",
    color: "green",
    description: "20-30 minutes, fundamental concepts",
  },
  medium: {
    label: "Medium",
    color: "yellow",
    description: "30-45 minutes, requires deeper understanding",
  },
  hard: {
    label: "Hard",
    color: "red",
    description: "45-60 minutes, complex algorithms",
  },
} as const;

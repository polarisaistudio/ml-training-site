---
title: "Linear Regression Implementation"
type: "ml-coding"
stage: "ml-ready"
difficulty: "easy"
verified: true
tags: ["machine-learning", "linear-regression", "coding", "numpy"]
source: "Real Interview"
sourceType: "real-interview"
realInterviewDetails:
  company: "Unknown"
  position: "ML Engineer"
  interviewDate: "2024-12-01"
  result: "pending"
---

## Question

Implement linear regression from scratch using gradient descent.

Given:
- Training data: X (n × m matrix) and y (n × 1 vector)
- X contains n samples with m features
- y contains n target values

Implement a `LinearRegression` class with:
- `fit(X, y, learning_rate, num_iterations)` - train the model
- `predict(X)` - make predictions
- Calculate and use gradient descent to optimize weights

**Example:**
```python
# Training data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])

# Train model
model = LinearRegression()
model.fit(X, y, learning_rate=0.01, num_iterations=1000)

# Make predictions
predictions = model.predict(np.array([[6], [7]]))
# Expected: [12, 14] (approximately)
```

## Hints

### Hint 1
Linear regression follows the formula: ŷ = Xw + b, where w is weights and b is bias. How do you initialize these parameters?

### Hint 2
The loss function is Mean Squared Error: L = (1/n) × Σ(yi - ŷi)². You need to compute gradients of this with respect to w and b.

### Hint 3
Gradient descent update rule: w = w - α × (∂L/∂w), where α is learning rate. The gradient ∂L/∂w = -(2/n) × X^T × (y - ŷ).

## Answer

### Approach: Gradient Descent Implementation

**Core Concepts:**

1. **Model:** ŷ = Xw + b
2. **Loss:** MSE = (1/n) × Σ(yi - ŷi)²
3. **Gradients:**
   - ∂L/∂w = -(2/n) × X^T × (y - ŷ)
   - ∂L/∂b = -(2/n) × Σ(y - ŷ)
4. **Update:** w = w - α × ∂L/∂w

### Complete Implementation

```python
import numpy as np

class LinearRegression:
    def __init__(self):
        """Initialize the linear regression model."""
        self.weights = None
        self.bias = None
        self.losses = []  # Track training loss
    
    def fit(self, X, y, learning_rate=0.01, num_iterations=1000):
        """
        Train the model using gradient descent.
        
        Args:
            X: Training features (n_samples, n_features)
            y: Training targets (n_samples,)
            learning_rate: Step size for gradient descent
            num_iterations: Number of training iterations
        """
        # Get dimensions
        n_samples, n_features = X.shape
        
        # Initialize parameters
        self.weights = np.zeros(n_features)
        self.bias = 0
        
        # Gradient descent
        for i in range(num_iterations):
            # Forward pass: compute predictions
            y_predicted = self.predict(X)
            
            # Compute loss (for tracking)
            loss = np.mean((y - y_predicted) ** 2)
            self.losses.append(loss)
            
            # Compute gradients
            dw = -(2 / n_samples) * X.T.dot(y - y_predicted)
            db = -(2 / n_samples) * np.sum(y - y_predicted)
            
            # Update parameters
            self.weights -= learning_rate * dw
            self.bias -= learning_rate * db
            
            # Optional: print progress
            if (i + 1) % 100 == 0:
                print(f"Iteration {i+1}: Loss = {loss:.4f}")
    
    def predict(self, X):
        """
        Make predictions using the trained model.
        
        Args:
            X: Input features (n_samples, n_features)
            
        Returns:
            Predictions (n_samples,)
        """
        return X.dot(self.weights) + self.bias
    
    def get_params(self):
        """Return the trained parameters."""
        return {
            'weights': self.weights,
            'bias': self.bias
        }
```

### Usage Example

```python
# Generate sample data
np.random.seed(42)
X = 2 * np.random.rand(100, 1)
y = 4 + 3 * X.squeeze() + np.random.randn(100)  # y = 3x + 4 + noise

# Train model
model = LinearRegression()
model.fit(X, y, learning_rate=0.01, num_iterations=1000)

# Make predictions
X_test = np.array([[0], [2]])
predictions = model.predict(X_test)
print(f"Predictions: {predictions}")

# Get learned parameters
params = model.get_params()
print(f"Learned weights: {params['weights']}")
print(f"Learned bias: {params['bias']}")
# Should be close to: weights ≈ [3], bias ≈ 4
```

### Vectorized vs Non-Vectorized

**Non-vectorized (slow):**
```python
# ❌ Inefficient: loop through samples
dw = 0
for i in range(n_samples):
    dw += (y[i] - y_predicted[i]) * X[i]
dw = -(2 / n_samples) * dw
```

**Vectorized (fast):**
```python
# ✅ Efficient: use matrix operations
dw = -(2 / n_samples) * X.T.dot(y - y_predicted)
```

### With Feature Normalization

For better convergence, normalize features:

```python
class LinearRegression:
    def __init__(self, normalize=True):
        self.weights = None
        self.bias = None
        self.normalize = normalize
        self.mean = None
        self.std = None
    
    def fit(self, X, y, learning_rate=0.01, num_iterations=1000):
        # Normalize features
        if self.normalize:
            self.mean = np.mean(X, axis=0)
            self.std = np.std(X, axis=0)
            X = (X - self.mean) / self.std
        
        # Rest of training code...
    
    def predict(self, X):
        # Apply same normalization
        if self.normalize:
            X = (X - self.mean) / self.std
        
        return X.dot(self.weights) + self.bias
```

### Complexity Analysis

**Time Complexity:**
- Training: O(iterations × n × m)
  - n = number of samples
  - m = number of features
- Prediction: O(n × m)

**Space Complexity:**
- O(m) for weights
- O(iterations) if storing loss history

### Common Mistakes

1. **Wrong gradient calculation:**
   ```python
   # ❌ Wrong sign
   dw = (2 / n_samples) * X.T.dot(y - y_predicted)
   
   # ✅ Correct
   dw = -(2 / n_samples) * X.T.dot(y - y_predicted)
   ```

2. **Forgetting bias term:**
   ```python
   # ❌ Only weights
   y_pred = X.dot(self.weights)
   
   # ✅ Weights + bias
   y_pred = X.dot(self.weights) + self.bias
   ```

3. **Not flattening y:**
   ```python
   # If y is (n, 1) instead of (n,), may cause shape issues
   y = y.flatten()
   ```

4. **Learning rate too large:**
   ```python
   # Loss diverges (goes to infinity)
   # Solution: reduce learning_rate or normalize features
   ```

### Interview Follow-ups

**Q: How do you know if gradient descent is converging?**
```python
# Plot loss over iterations
import matplotlib.pyplot as plt
plt.plot(model.losses)
plt.xlabel('Iteration')
plt.ylabel('Loss')
plt.show()
# Should see decreasing curve that plateaus
```

**Q: What if features have different scales?**
A: Normalize features before training (z-score normalization or min-max scaling)

**Q: How is this different from using sklearn?**
```python
from sklearn.linear_model import LinearRegression as SklearnLR

# Sklearn uses closed-form solution (normal equation)
# Faster for small datasets, but doesn't scale to large data
sklearn_model = SklearnLR()
sklearn_model.fit(X, y)
```

**Q: When would you use gradient descent vs normal equation?**
- Gradient descent: Large datasets, scales to millions of samples
- Normal equation: Small datasets, exact solution, no iterations needed

### Closed-Form Solution (Bonus)

```python
def fit_normal_equation(X, y):
    """
    Solve using normal equation: w = (X^T X)^(-1) X^T y
    
    Pros: Exact solution, no iterations
    Cons: Slow for large datasets (O(n³))
    """
    # Add bias column
    X_b = np.c_[np.ones((X.shape[0], 1)), X]
    
    # Compute weights
    theta = np.linalg.inv(X_b.T.dot(X_b)).dot(X_b.T).dot(y)
    
    bias = theta[0]
    weights = theta[1:]
    
    return weights, bias
```

## Learning Resources

**Videos:**
- [StatQuest: Linear Regression](https://www.youtube.com/watch?v=nk2CQITm_eo)
- [3Blue1Brown: Gradient Descent](https://www.youtube.com/watch?v=IHZwWFHWa-w)

**Articles:**
- [Linear Regression from Scratch - Towards Data Science](https://towardsdatascience.com/linear-regression-from-scratch-cd0dee067f72)
- [Understanding Gradient Descent](https://ml-cheatsheet.readthedocs.io/en/latest/gradient_descent.html)

**Related Problems:**
- Logistic Regression Implementation
- Ridge Regression from Scratch
- Polynomial Regression
- Batch vs Stochastic Gradient Descent

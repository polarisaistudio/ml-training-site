---
title: "Regularization: L1, L2, and Beyond"
type: "ml-concept"
stage: "ml-ready"
difficulty: "medium"
verified: true
tags: ["machine-learning", "regularization", "overfitting", "optimization"]
source: "Generated"
---

## Question

Implement and compare different regularization techniques to prevent overfitting in machine learning models.

### Part 1: Implement L1 (Lasso) Regularization

```python
import numpy as np

class LassoRegression:
    """
    Linear Regression with L1 (Lasso) Regularization
    
    Penalty: α * Σ|w|
    """
    def __init__(self, alpha=1.0, learning_rate=0.01, num_iterations=1000):
        """
        Args:
            alpha: Regularization strength (λ)
            learning_rate: Step size for gradient descent
            num_iterations: Number of training iterations
        """
        self.alpha = alpha
        self.learning_rate = learning_rate
        self.num_iterations = num_iterations
        self.weights = None
        self.bias = None
        
    def fit(self, X, y):
        """
        Train the model with L1 regularization
        
        TODO: Implement L1 regularized gradient descent
        - Loss = MSE + α * Σ|w|
        - Gradient for L1: sign(w)
        """
        pass
    
    def predict(self, X):
        """Make predictions"""
        pass
```

### Part 2: Implement L2 (Ridge) Regularization

```python
class RidgeRegression:
    """
    Linear Regression with L2 (Ridge) Regularization
    
    Penalty: α * Σw²
    """
    def __init__(self, alpha=1.0, learning_rate=0.01, num_iterations=1000):
        self.alpha = alpha
        self.learning_rate = learning_rate
        self.num_iterations = num_iterations
        self.weights = None
        self.bias = None
        
    def fit(self, X, y):
        """
        Train the model with L2 regularization
        
        TODO: Implement L2 regularized gradient descent
        - Loss = MSE + α * Σw²
        - Gradient for L2: 2 * α * w
        """
        pass
    
    def predict(self, X):
        """Make predictions"""
        pass
```

### Part 3: Implement Elastic Net (L1 + L2)

```python
class ElasticNet:
    """
    Linear Regression with Elastic Net Regularization
    
    Penalty: α₁ * Σ|w| + α₂ * Σw²
    Combines L1 and L2
    """
    def __init__(self, alpha_l1=0.5, alpha_l2=0.5, learning_rate=0.01, num_iterations=1000):
        """
        Args:
            alpha_l1: L1 regularization strength
            alpha_l2: L2 regularization strength
        """
        self.alpha_l1 = alpha_l1
        self.alpha_l2 = alpha_l2
        self.learning_rate = learning_rate
        self.num_iterations = num_iterations
        self.weights = None
        self.bias = None
        
    def fit(self, X, y):
        """
        Train with both L1 and L2 regularization
        
        TODO: Implement Elastic Net gradient descent
        - Loss = MSE + α₁ * Σ|w| + α₂ * Σw²
        - Gradient: sign(w) for L1 + 2*α₂*w for L2
        """
        pass
    
    def predict(self, X):
        """Make predictions"""
        pass
```

### Part 4: Compare All Methods

```python
def compare_regularization(X_train, y_train, X_test, y_test):
    """
    Compare different regularization methods
    
    TODO: Train all 3 models and compare:
    - Training error
    - Test error
    - Number of zero weights (sparsity)
    - Weight magnitudes
    """
    pass
```

## Hints

### Hint 1
**L1 vs L2 Gradient:**

**L1 (Lasso):**
```
Gradient = sign(w) = {
  +1 if w > 0
  -1 if w < 0
   0 if w = 0
}
```

**L2 (Ridge):**
```
Gradient = 2 * α * w
```

Key difference: L1 uses sign, L2 uses actual value!

### Hint 2
**Handling L1's Non-differentiability:**

L1 is not differentiable at w=0. Use **soft thresholding** or **subgradient**:

```python
# Soft thresholding approach
def soft_threshold(w, lambda_):
    if w > lambda_:
        return w - lambda_
    elif w < -lambda_:
        return w + lambda_
    else:
        return 0
```

### Hint 3
**Weight Update Formula:**

**Standard gradient descent:**
```
w = w - lr * gradient
```

**With L1:**
```
w = w - lr * (∂MSE/∂w + α * sign(w))
```

**With L2:**
```
w = w - lr * (∂MSE/∂w + 2 * α * w)
```

## Answer

### L1 (Lasso) Regularization

```python
import numpy as np

class LassoRegression:
    def __init__(self, alpha=1.0, learning_rate=0.01, num_iterations=1000):
        self.alpha = alpha
        self.learning_rate = learning_rate
        self.num_iterations = num_iterations
        self.weights = None
        self.bias = None
        self.losses = []
        
    def fit(self, X, y):
        n_samples, n_features = X.shape
        
        # Initialize weights
        self.weights = np.zeros(n_features)
        self.bias = 0
        
        # Gradient descent
        for i in range(self.num_iterations):
            # Forward pass
            y_predicted = X.dot(self.weights) + self.bias
            
            # Compute loss (MSE + L1 penalty)
            mse_loss = np.mean((y - y_predicted) ** 2)
            l1_penalty = self.alpha * np.sum(np.abs(self.weights))
            total_loss = mse_loss + l1_penalty
            self.losses.append(total_loss)
            
            # Compute gradients
            # MSE gradient
            dw_mse = -(2 / n_samples) * X.T.dot(y - y_predicted)
            db = -(2 / n_samples) * np.sum(y - y_predicted)
            
            # L1 gradient (subgradient)
            dw_l1 = self.alpha * np.sign(self.weights)
            
            # Combined gradient
            dw = dw_mse + dw_l1
            
            # Update parameters
            self.weights -= self.learning_rate * dw
            self.bias -= self.learning_rate * db
            
            # Optional: Print progress
            if (i + 1) % 100 == 0:
                print(f"Iteration {i+1}: Loss = {total_loss:.4f}, Sparsity = {np.sum(self.weights == 0)}/{n_features}")
    
    def predict(self, X):
        return X.dot(self.weights) + self.bias
    
    def get_sparsity(self):
        """Return percentage of zero weights"""
        return np.sum(np.abs(self.weights) < 1e-10) / len(self.weights) * 100
```

### L2 (Ridge) Regularization

```python
class RidgeRegression:
    def __init__(self, alpha=1.0, learning_rate=0.01, num_iterations=1000):
        self.alpha = alpha
        self.learning_rate = learning_rate
        self.num_iterations = num_iterations
        self.weights = None
        self.bias = None
        self.losses = []
        
    def fit(self, X, y):
        n_samples, n_features = X.shape
        
        # Initialize weights
        self.weights = np.zeros(n_features)
        self.bias = 0
        
        # Gradient descent
        for i in range(self.num_iterations):
            # Forward pass
            y_predicted = X.dot(self.weights) + self.bias
            
            # Compute loss (MSE + L2 penalty)
            mse_loss = np.mean((y - y_predicted) ** 2)
            l2_penalty = self.alpha * np.sum(self.weights ** 2)
            total_loss = mse_loss + l2_penalty
            self.losses.append(total_loss)
            
            # Compute gradients
            # MSE gradient
            dw_mse = -(2 / n_samples) * X.T.dot(y - y_predicted)
            db = -(2 / n_samples) * np.sum(y - y_predicted)
            
            # L2 gradient
            dw_l2 = 2 * self.alpha * self.weights
            
            # Combined gradient
            dw = dw_mse + dw_l2
            
            # Update parameters
            self.weights -= self.learning_rate * dw
            self.bias -= self.learning_rate * db
            
            # Optional: Print progress
            if (i + 1) % 100 == 0:
                avg_weight = np.mean(np.abs(self.weights))
                print(f"Iteration {i+1}: Loss = {total_loss:.4f}, Avg |w| = {avg_weight:.4f}")
    
    def predict(self, X):
        return X.dot(self.weights) + self.bias
```

### Elastic Net (L1 + L2)

```python
class ElasticNet:
    def __init__(self, alpha_l1=0.5, alpha_l2=0.5, learning_rate=0.01, num_iterations=1000):
        self.alpha_l1 = alpha_l1
        self.alpha_l2 = alpha_l2
        self.learning_rate = learning_rate
        self.num_iterations = num_iterations
        self.weights = None
        self.bias = None
        self.losses = []
        
    def fit(self, X, y):
        n_samples, n_features = X.shape
        
        # Initialize weights
        self.weights = np.zeros(n_features)
        self.bias = 0
        
        # Gradient descent
        for i in range(self.num_iterations):
            # Forward pass
            y_predicted = X.dot(self.weights) + self.bias
            
            # Compute loss (MSE + L1 + L2)
            mse_loss = np.mean((y - y_predicted) ** 2)
            l1_penalty = self.alpha_l1 * np.sum(np.abs(self.weights))
            l2_penalty = self.alpha_l2 * np.sum(self.weights ** 2)
            total_loss = mse_loss + l1_penalty + l2_penalty
            self.losses.append(total_loss)
            
            # Compute gradients
            # MSE gradient
            dw_mse = -(2 / n_samples) * X.T.dot(y - y_predicted)
            db = -(2 / n_samples) * np.sum(y - y_predicted)
            
            # L1 gradient
            dw_l1 = self.alpha_l1 * np.sign(self.weights)
            
            # L2 gradient
            dw_l2 = 2 * self.alpha_l2 * self.weights
            
            # Combined gradient
            dw = dw_mse + dw_l1 + dw_l2
            
            # Update parameters
            self.weights -= self.learning_rate * dw
            self.bias -= self.learning_rate * db
            
            # Optional: Print progress
            if (i + 1) % 100 == 0:
                sparsity = np.sum(np.abs(self.weights) < 1e-10)
                avg_weight = np.mean(np.abs(self.weights))
                print(f"Iteration {i+1}: Loss = {total_loss:.4f}, Sparsity = {sparsity}/{n_features}, Avg |w| = {avg_weight:.4f}")
    
    def predict(self, X):
        return X.dot(self.weights) + self.bias
    
    def get_sparsity(self):
        return np.sum(np.abs(self.weights) < 1e-10) / len(self.weights) * 100
```

### Comparison Function

```python
import matplotlib.pyplot as plt

def compare_regularization(X_train, y_train, X_test, y_test, alpha=1.0):
    """
    Compare L1, L2, and Elastic Net regularization
    """
    # Train all models
    lasso = LassoRegression(alpha=alpha, num_iterations=1000)
    ridge = RidgeRegression(alpha=alpha, num_iterations=1000)
    elastic = ElasticNet(alpha_l1=alpha/2, alpha_l2=alpha/2, num_iterations=1000)
    
    print("Training Lasso...")
    lasso.fit(X_train, y_train)
    
    print("\nTraining Ridge...")
    ridge.fit(X_train, y_train)
    
    print("\nTraining Elastic Net...")
    elastic.fit(X_train, y_train)
    
    # Evaluate
    models = {
        'Lasso (L1)': lasso,
        'Ridge (L2)': ridge,
        'Elastic Net': elastic
    }
    
    print("\n" + "="*60)
    print("COMPARISON RESULTS")
    print("="*60)
    
    for name, model in models.items():
        # Predictions
        y_train_pred = model.predict(X_train)
        y_test_pred = model.predict(X_test)
        
        # Errors
        train_mse = np.mean((y_train - y_train_pred) ** 2)
        test_mse = np.mean((y_test - y_test_pred) ** 2)
        
        # Weight statistics
        n_features = len(model.weights)
        n_zero_weights = np.sum(np.abs(model.weights) < 1e-10)
        sparsity = (n_zero_weights / n_features) * 100
        avg_weight = np.mean(np.abs(model.weights))
        max_weight = np.max(np.abs(model.weights))
        
        print(f"\n{name}:")
        print(f"  Training MSE:    {train_mse:.4f}")
        print(f"  Test MSE:        {test_mse:.4f}")
        print(f"  Sparsity:        {sparsity:.1f}% ({n_zero_weights}/{n_features} weights = 0)")
        print(f"  Avg |weight|:    {avg_weight:.4f}")
        print(f"  Max |weight|:    {max_weight:.4f}")
    
    return lasso, ridge, elastic
```

### Example Usage

```python
# Generate synthetic data with some irrelevant features
np.random.seed(42)
n_samples = 100
n_features = 20
n_relevant_features = 5

# True weights (only first 5 are non-zero)
true_weights = np.zeros(n_features)
true_weights[:n_relevant_features] = np.random.randn(n_relevant_features) * 2

# Generate data
X = np.random.randn(n_samples, n_features)
y = X.dot(true_weights) + np.random.randn(n_samples) * 0.5

# Split train/test
split = int(0.8 * n_samples)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

# Compare methods
lasso, ridge, elastic = compare_regularization(X_train, y_train, X_test, y_test, alpha=0.1)

# Show which features were selected by Lasso
print("\nTrue relevant features: 0-4")
print(f"Lasso selected features: {np.where(np.abs(lasso.weights) > 1e-10)[0]}")
```

### Key Concepts Summary

**L1 (Lasso):**
- Forces some weights to exactly zero
- Automatic feature selection
- Use when many features are irrelevant

**L2 (Ridge):**
- Makes all weights smaller but none zero
- Better for correlated features
- Use when all features contribute

**Elastic Net:**
- Combines L1 and L2 benefits
- Good default choice when unsure
- Handles correlated features while doing selection

**Choosing α (lambda):**
- Use cross-validation
- α = 0: No regularization (overfitting risk)
- α too large: Underfitting
- Try: [0.001, 0.01, 0.1, 1, 10, 100]

## Learning Resources

**Articles:**
- [Regularization in Machine Learning - Towards Data Science](https://towardsdatascience.com/regularization-in-machine-learning-76441ddcf99a)
- [L1 and L2 Regularization Methods - Analytics Vidhya](https://www.analyticsvidhya.com/blog/2021/05/complete-guide-to-regularization-techniques-in-machine-learning/)

**Videos:**
- StatQuest: Regularization concepts explained visually
- 3Blue1Brown: Gradient Descent visualization

**Related Topics:**
- Bias-Variance Tradeoff
- Cross-Validation for hyperparameter tuning
- Feature Selection Methods
- Overfitting vs Underfitting

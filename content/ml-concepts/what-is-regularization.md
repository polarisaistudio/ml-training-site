---
title: "What is Regularization?"
type: "ml-concept"
stage: "ml-ready"
difficulty: "medium"
verified: true
tags: ["machine-learning", "regularization", "overfitting", "theory"]
source: "Real Interview"
sourceType: "real-interview"
realInterviewDetails:
  company: "Unknown"
  position: "ML Engineer"
  interviewDate: "2024-12-01"
  result: "pending"
---

## Question

What is regularization in machine learning? Explain why we use it and describe the main types.

## Hints

### Hint 1
Think about what happens when a model learns the training data too well. What problem does this cause?

### Hint 2
Regularization adds something extra to the loss function. What would penalizing large weights accomplish?

### Hint 3
There are two main types of regularization: L1 (Lasso) and L2 (Ridge). What's the key difference in how they penalize weights?

## Answer

### What is Regularization?

**Regularization** is a technique used to prevent overfitting by adding a penalty term to the model's loss function. This penalty discourages the model from learning overly complex patterns that fit the training data too closely but don't generalize well to new data.

### Why Use Regularization?

**Problem: Overfitting**
- Model performs extremely well on training data
- Poor performance on test/validation data
- Model has learned noise and specific patterns instead of general trends

**Solution: Regularization**
- Constrains model complexity
- Reduces variance at the cost of slight increase in bias
- Improves generalization to unseen data

### Main Types of Regularization

#### 1. L2 Regularization (Ridge)

**Formula:**
```
Loss = Original_Loss + λ × Σ(wi²)
```

**Characteristics:**
- Adds sum of squared weights to loss
- Penalizes large weights proportionally to their magnitude
- Drives weights toward zero but rarely exactly zero
- All features remain in model (weight shrinkage)

**When to use:**
- When you believe all features contribute to prediction
- Want to reduce weight magnitudes without feature selection
- Prevents any single feature from dominating

**Example:**
```python
from sklearn.linear_model import Ridge

# Ridge regression with L2 regularization
model = Ridge(alpha=1.0)  # alpha = λ (regularization strength)
model.fit(X_train, y_train)
```

#### 2. L1 Regularization (Lasso)

**Formula:**
```
Loss = Original_Loss + λ × Σ|wi|
```

**Characteristics:**
- Adds sum of absolute values of weights
- Can drive weights to exactly zero
- Performs automatic feature selection
- Creates sparse models (many weights = 0)

**When to use:**
- When you suspect many features are irrelevant
- Want interpretable model with fewer features
- Need feature selection as part of training

**Example:**
```python
from sklearn.linear_model import Lasso

# Lasso regression with L1 regularization
model = Lasso(alpha=1.0)
model.fit(X_train, y_train)

# Check which features were selected (non-zero coefficients)
selected_features = X.columns[model.coef_ != 0]
```

#### 3. Elastic Net (L1 + L2)

**Formula:**
```
Loss = Original_Loss + λ₁ × Σ|wi| + λ₂ × Σ(wi²)
```

**Characteristics:**
- Combines L1 and L2 penalties
- Gets benefits of both approaches
- Can select features while maintaining grouped correlations

**When to use:**
- When features are correlated (L1 alone is unstable)
- Want feature selection but need to handle correlation

**Example:**
```python
from sklearn.linear_model import ElasticNet

# Elastic Net with both L1 and L2
model = ElasticNet(alpha=1.0, l1_ratio=0.5)  # l1_ratio controls L1/L2 mix
model.fit(X_train, y_train)
```

### Key Parameter: λ (Lambda)

**Regularization strength:**
- λ = 0: No regularization (may overfit)
- Small λ: Light regularization
- Large λ: Strong regularization (may underfit)

**How to choose λ:**
- Use cross-validation
- Try multiple values: [0.001, 0.01, 0.1, 1, 10, 100]
- Select λ with best validation performance

### Visual Comparison

```
Feature Weights with Different Regularization:

No Regularization:
w = [5.2, -3.1, 8.7, 0.4, -2.3]  ← Large, varied weights

L2 (Ridge):
w = [2.1, -1.2, 3.4, 0.2, -0.9]  ← All smaller, none zero

L1 (Lasso):
w = [3.5, 0, 5.2, 0, 0]          ← Some exactly zero (sparse)
```

### Other Regularization Techniques

Beyond L1/L2, other common techniques include:

**Dropout** (Neural Networks):
- Randomly drop neurons during training
- Prevents co-adaptation of neurons

**Early Stopping:**
- Stop training when validation error increases
- Prevents overfitting to training data

**Data Augmentation:**
- Artificially expand training set
- Adds noise/variations to prevent overfitting

### Interview Follow-up Questions

**Q: When would you use L1 vs L2?**
A: 
- L1 when you want feature selection and sparse models
- L2 when all features are relevant but need weight control
- Elastic Net when features are correlated

**Q: How does regularization affect bias-variance tradeoff?**
A: Increases bias slightly, but significantly reduces variance, leading to better generalization.

**Q: Can you have too much regularization?**
A: Yes, too large λ causes underfitting - model becomes too simple and can't capture real patterns.

**Q: How is regularization different from feature selection?**
A: Regularization is automatic during training; feature selection is typically a separate preprocessing step. L1 regularization can do both simultaneously.

## Learning Resources

**Articles:**
- [Regularization in Machine Learning - Towards Data Science](https://towardsdatascience.com/regularization-in-machine-learning-76441ddcf99a)
- [L1 and L2 Regularization Methods - Analytics Vidhya](https://www.analyticsvidhya.com/blog/2021/05/complete-guide-to-regularization-techniques-in-machine-learning/)

**Videos:**
- StatQuest: Regularization concepts explained visually

**Related Topics:**
- Bias-Variance Tradeoff
- Cross-Validation
- Feature Selection Methods
- Overfitting vs Underfitting

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { contentItems, contentTypes, questions, stages } from "./schema";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// ML Concepts data with structured answers
const mlConcepts = [
  {
    id: "sl-01",
    title: "What is overfitting? How do you prevent it?",
    difficulty: "easy",
    tags: ["fundamental", "regularization", "must-know"],
    estimatedTime: "3-5 minutes",
    content: `## Question

What is overfitting? How do you prevent it?

This is a fundamental ML concept that every engineer should be able to explain clearly.

**Expected time to answer:** 3-5 minutes`,
    answer: {
      tldr:
        "Overfitting is when a model learns training data too well, including noise, and performs poorly on new data.",
      definition:
        "Overfitting occurs when a model captures not only underlying patterns but also random noise in training data, resulting in high training accuracy but poor generalization to unseen data.",
      intuition:
        "Like memorizing practice exam answers instead of understanding concepts. You ace the practice test but fail the real exam with different questions.",
      example:
        'In sentiment analysis, if I fine-tuned only on formal product reviews, the model might overfit to phrases like "great product" but fail on casual social media text like "ngl this slaps".',
      whenToUse:
        "Monitor for overfitting when: (1) Limited training data, (2) Many model parameters, (3) Training for many epochs, (4) High feature correlation. Prevent with: regularization (L1/L2), dropout, early stopping, data augmentation, cross-validation.",
      answerLevels: {
        junior:
          "Overfitting is when the model works great on training data but poorly on test data. Prevent with more data, regularization, or early stopping.",
        mid: "Overfitting occurs when model captures noise rather than patterns, shown by training accuracy >> validation accuracy. Prevent with: cross-validation, regularization (L1/L2), dropout, early stopping, data augmentation, reducing model complexity.",
        senior:
          "Overfitting represents high model variance in bias-variance tradeoff. Detection: monitor train vs validation metrics, learning curves, complexity vs data size. Prevention: L1/L2 regularization, dropout, batch normalization, ensemble methods, early stopping with patience, cross-validation. In production, implement drift monitoring since overfitting to historical data becomes problematic as distributions shift.",
      },
      followUpQuestions: [
        "What is the bias-variance tradeoff?",
        "How do you choose regularization strength?",
        "Can linear regression overfit?",
        "How does dropout prevent overfitting?",
      ],
    },
  },
  {
    id: "sl-02",
    title: "Explain the bias-variance tradeoff.",
    difficulty: "easy",
    tags: ["fundamental", "theory", "must-know"],
    estimatedTime: "4-6 minutes",
    content: `## Question

Explain the bias-variance tradeoff.

This is one of the most important theoretical concepts in machine learning.

**Expected time to answer:** 4-6 minutes`,
    answer: {
      tldr:
        "Balance between model being too simple (high bias) or too complex (high variance).",
      definition:
        "Bias is error from incorrect assumptions (underfitting), variance is error from sensitivity to training data (overfitting). Total error = Bias² + Variance + Irreducible Error.",
      intuition:
        "Archery analogy: High bias = arrows consistently miss target in same direction (miscalibrated bow). High variance = arrows scattered everywhere (inconsistent). Best archer has low bias (accurate on average) and low variance (consistent).",
      example:
        "Sentiment analysis: Using only word counts = high bias (too simple, ignores context). Using massive transformer on tiny dataset = high variance (overfits). DistilBERT with fine-tuning = balanced.",
      whenToUse:
        "Guides decisions: (1) Model complexity choice, (2) Regularization strength, (3) Training set size, (4) Feature selection, (5) Ensemble methods (bagging reduces variance, boosting reduces bias).",
      answerLevels: {
        junior:
          "Finding right model complexity—not too simple (high bias) and not too complex (high variance).",
        mid: "Total error = Bias² + Variance + irreducible error. Simple models: high bias, low variance. Complex models: low bias, high variance. Minimize total error through cross-validation, regularization, ensembles.",
        senior:
          "Expected test error decomposition: Bias² (systematic error from model assumptions) + Variance (sensitivity to training data) + irreducible error. Increasing capacity reduces bias but increases variance. Optimal complexity minimizes their sum via cross-validation. Regularization trades bias for reduced variance. Ensemble methods achieve lower total error than single models. Modern deep learning operates in overparameterized regime where classical tradeoff behaves differently due to implicit regularization.",
      },
      followUpQuestions: [
        "How does regularization affect this tradeoff?",
        "Can ensembles reduce both bias and variance?",
        "How to diagnose high bias vs high variance?",
      ],
    },
  },
  {
    id: "dl-01",
    title: "Explain backpropagation. How does it work?",
    difficulty: "medium",
    tags: ["deep-learning", "optimization", "must-know"],
    estimatedTime: "5-7 minutes",
    content: `## Question

Explain backpropagation. How does it work?

This is the fundamental algorithm for training neural networks.

**Expected time to answer:** 5-7 minutes`,
    answer: {
      tldr:
        "Algorithm using chain rule to efficiently compute gradients of loss with respect to all parameters.",
      definition:
        "Backpropagation computes gradient of loss function with respect to each weight by applying chain rule in reverse order, from output layer to input layer. Gradients are then used by optimizer to update weights.",
      intuition:
        "Like adjusting knobs on a machine: (1) Run machine forward and measure error, (2) Work backward, figuring out how much each knob contributed to error, (3) Adjust each knob proportionally to its responsibility.",
      example:
        "In BERT sentiment model: incorrect classification → loss computed → gradients flow backward through 12 transformer layers → attention weights and embeddings adjusted proportionally to their error contribution.",
      whenToUse:
        "THE training algorithm for neural networks. Used for: (1) Training any neural network, (2) Fine-tuning pre-trained models, (3) Custom loss functions. Modern frameworks (PyTorch, TensorFlow) implement autograd, but understanding backprop is crucial for debugging and custom architectures.",
      answerLevels: {
        junior:
          "Calculates how much each weight contributed to error using chain rule, then adjusts weights. Works backward from output to input.",
        mid: "Computes gradients via chain rule: (1) Forward pass computes activations and loss, (2) Backward pass computes gradients from output: dL/doutput → dL/dweights, (3) Optimizer updates weights. Efficient—one backward pass computes all gradients. Challenges: vanishing/exploding gradients in deep networks.",
        senior:
          "Automatic differentiation using reverse-mode differentiation on computational graph. Forward: compute and store z^(l) = W^(l)a^(l-1) + b^(l) and a^(l) = σ(z^(l)). Backward: apply chain rule recursively: dL/dW^(l) = δ^(l)(a^(l-1))^T. Complexity O(W) where W = number of weights. Modern frameworks use computational graphs and autograd. Challenges: gradient flow through deep networks causes vanishing/exploding gradients, mitigated by: Xavier/He initialization, batch/layer normalization, residual connections, gradient clipping.",
      },
      followUpQuestions: [
        "What is vanishing gradient problem?",
        "How does autograd work in PyTorch?",
        "How do residual connections help?",
      ],
    },
  },
  {
    id: "eval-01",
    title: "Explain precision, recall, and F1 score. When to optimize for which?",
    difficulty: "easy",
    tags: ["evaluation", "metrics", "must-know"],
    estimatedTime: "4-5 minutes",
    content: `## Question

Explain precision, recall, and F1 score. When to optimize for which?

Understanding these metrics is essential for any ML engineer.

**Expected time to answer:** 4-5 minutes`,
    answer: {
      tldr:
        "Precision = accuracy of positive predictions. Recall = coverage of actual positives. F1 = harmonic mean of both.",
      definition:
        'Precision = TP/(TP+FP) measures "when model predicts positive, how often is it correct?" Recall = TP/(TP+FN) measures "of all actual positives, how many did model find?" F1 = 2*(Precision*Recall)/(Precision+Recall) balances both.',
      intuition:
        'Medical test analogy: Precision = "when test says you have disease, how likely do you actually have it?" (avoid false alarms). Recall = "of all people with disease, how many did test catch?" (avoid missing cases). High precision = few false positives. High recall = few false negatives.',
      example:
        "Spam detection: High precision = few legitimate emails marked spam (fewer false positives). High recall = catch all spam (fewer false negatives). Fraud detection: prioritize recall (catch all fraud, okay with false alarms). Medical diagnosis: balance both (miss disease = bad, unnecessary treatment = bad).",
      whenToUse:
        "Optimize precision when: false positives costly (spam detection, content moderation). Optimize recall when: false negatives costly (fraud detection, disease screening, security threats). Use F1 when: balance matters or classes imbalanced. Use F1 instead of accuracy for imbalanced datasets.",
      answerLevels: {
        junior:
          "Precision = correct positive predictions / total positive predictions. Recall = correct positive predictions / total actual positives. F1 = harmonic mean. Choose based on whether false positives or false negatives are worse.",
        mid: "Precision = TP/(TP+FP), Recall = TP/(TP+FN), F1 = 2PR/(P+R). Precision-recall tradeoff: can increase precision by being more conservative (fewer false positives but more false negatives) or increase recall by being more liberal (fewer false negatives but more false positives). Context determines optimization: spam needs high precision, fraud needs high recall. F1 for balance. ROC-AUC for threshold-independent evaluation.",
        senior:
          "Precision and recall represent different error types in hypothesis testing: precision minimizes Type I errors (false positives), recall minimizes Type II errors (false negatives). Precision-recall curve shows tradeoff across thresholds—more informative than ROC for imbalanced datasets. F1 is harmonic mean (not arithmetic) because it penalizes extreme values. F-beta score generalizes: β<1 favors precision, β>1 favors recall. In production: precision matters for user-facing systems (bad UX from false positives), recall matters for safety/security (missing threats dangerous). A/B test to optimize for business metrics, not just F1. Consider calibration—high F1 doesn't mean probabilities are well-calibrated.",
      },
      followUpQuestions: [
        "What is ROC-AUC and when to use it?",
        "How to handle precision-recall tradeoff?",
        "What is F-beta score?",
      ],
    },
  },
  {
    id: "nlp-01",
    title: "What is the attention mechanism in transformers?",
    difficulty: "medium",
    tags: ["nlp", "transformers", "deep-learning", "must-know"],
    estimatedTime: "5-7 minutes",
    content: `## Question

What is the attention mechanism in transformers?

This is a critical concept for modern NLP and increasingly for other domains.

**Expected time to answer:** 5-7 minutes`,
    answer: {
      tldr:
        "Attention allows model to focus on relevant parts of input when processing each element, rather than treating all positions equally.",
      definition:
        "Attention mechanism computes weighted representation of input sequence where weights determine how much each position should influence output at current position. Self-attention in transformers allows each token to attend to all other tokens, capturing long-range dependencies.",
      intuition:
        'Reading comprehension analogy: When you answer "What did John eat?", you focus on relevant sentence parts mentioning John and eating, not irrelevant details. Attention does this automatically—learns to focus on relevant context for each word.',
      example:
        'Sentiment analysis: In "The movie was not good", attention helps model focus on "not" when processing "good", correctly understanding negation. Without attention, "good" might be interpreted positively. Attention weights show which words the model considers important for each word.',
      whenToUse:
        "Core component of transformers (BERT, GPT). Use when: (1) Long-range dependencies matter, (2) Parallel processing important (vs sequential RNNs), (3) Interpretability valuable (attention weights show what model focuses on). Transformers now dominate NLP, increasingly used in vision (ViT) and other domains.",
      answerLevels: {
        junior:
          "Mechanism allowing model to focus on relevant parts of input. In transformers, each word can attend to all other words to understand context.",
        mid: "Self-attention computes attention scores between all token pairs: (1) Project tokens to queries Q, keys K, values V, (2) Compute attention weights: softmax(QK^T/√d), (3) Weighted sum of values. Multi-head attention runs this in parallel with different projections. Benefits: captures long-range dependencies, fully parallel (vs sequential RNNs), provides interpretability through attention weights.",
        senior:
          "Self-attention: Attention(Q,K,V) = softmax(QK^T/√d_k)V where Q=XW_Q, K=XW_K, V=XW_V. Scaling by √d_k prevents softmax saturation. Multi-head attention: run h attention heads in parallel, concatenate outputs, project: MultiHead(Q,K,V) = Concat(head_1,...,head_h)W_O where head_i = Attention(QW_i^Q, KW_i^K, VW_i^V). Benefits over RNNs: O(1) sequential operations (vs O(n) for RNNs) enables parallelization, directly models long-range dependencies without gradient flow issues. Computational complexity O(n²d) where n=sequence length—quadratic in length, motivating efficient attention variants (linear attention, sparse attention) for long sequences. Positional encoding necessary since attention is permutation-invariant. In transformers, attention is applied in encoder (self-attention on input), decoder (self-attention + cross-attention to encoder output).",
      },
      followUpQuestions: [
        "Why scale by √d_k in attention?",
        "What is multi-head attention?",
        "How do transformers handle word order?",
        "What are efficient attention mechanisms for long sequences?",
      ],
    },
  },
];

// Format structured answer into markdown
function formatAnswerAsMarkdown(answer: (typeof mlConcepts)[0]["answer"]): string {
  return `## TL;DR

${answer.tldr}

## Definition

${answer.definition}

## Intuition (ELI5)

${answer.intuition}

## Example

${answer.example}

## When to Use

${answer.whenToUse}

## Answer by Experience Level

### Junior Level
${answer.answerLevels.junior}

### Mid Level
${answer.answerLevels.mid}

### Senior Level
${answer.answerLevels.senior}

## Follow-up Questions

${answer.followUpQuestions.map((q) => `- ${q}`).join("\n")}
`;
}

async function seedMLConcepts() {
  console.log("Seeding ML Concepts...");

  // Get the ml_concept content type
  const mlConceptType = await db
    .select()
    .from(contentTypes)
    .where(eq(contentTypes.slug, "ml_concept"))
    .limit(1);

  if (!mlConceptType[0]) {
    console.error("ml_concept content type not found. Run seed.ts first.");
    return;
  }

  // Get the ml-ready stage
  const mlReadyStage = await db
    .select()
    .from(stages)
    .where(eq(stages.slug, "ml-ready"))
    .limit(1);

  if (!mlReadyStage[0]) {
    console.error("ml-ready stage not found. Run seed.ts first.");
    return;
  }

  const contentTypeId = mlConceptType[0].id;
  const stageId = mlReadyStage[0].id;

  for (let i = 0; i < mlConcepts.length; i++) {
    const concept = mlConcepts[i];
    console.log(`Adding: ${concept.title}`);

    // Check if content item already exists
    const existing = await db
      .select()
      .from(contentItems)
      .innerJoin(questions, eq(contentItems.id, questions.contentItemId))
      .where(eq(contentItems.title, concept.title))
      .limit(1);

    if (existing[0]) {
      console.log(`  Skipping (already exists): ${concept.title}`);
      continue;
    }

    // Insert content item
    const [contentItem] = await db
      .insert(contentItems)
      .values({
        stageId: stageId,
        contentTypeId: contentTypeId,
        title: concept.title,
        description: `ML Concept: ${concept.estimatedTime} to answer`,
        difficulty: concept.difficulty,
        isAvailable: true,
        order: 100 + i, // Start at 100 to not conflict with existing
      })
      .returning();

    // Insert question with structured answer
    await db.insert(questions).values({
      contentItemId: contentItem.id,
      content: concept.content,
      answer: formatAnswerAsMarkdown(concept.answer),
      tags: JSON.stringify(concept.tags),
      sourceType: "generated",
    });

    console.log(`  Added: ${concept.title}`);
  }

  console.log("ML Concepts seeding complete!");
}

seedMLConcepts().catch(console.error);

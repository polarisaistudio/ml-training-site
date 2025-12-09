export interface TutorialStep {
  title: string;
  duration: number; // minutes
  content: string; // markdown
}

export interface InterviewQA {
  id: string;
  question: string;
  starAnswer: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  keyPoints: string[];
}

export interface ProjectTemplate {
  id: string;
  title: string;
  category: "nlp" | "cv" | "data" | "web" | "ml";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  tags: string[];

  // Overview
  overview: string;
  whatYouLearn: string[];
  prerequisites: string[];

  // Tutorial
  tutorialSteps: TutorialStep[];

  // Resume content (3 versions)
  resumeBullets: {
    technical: string[];
    impact: string[];
    fullStack: string[];
  };

  // Interview prep
  interviewQA: InterviewQA[];
}

// For Phase 1, start with ONE example project (we'll add more later)
export const PROJECT_TEMPLATES: Record<string, ProjectTemplate> = {
  "sentiment-chatbot": {
    id: "sentiment-chatbot",
    title: "Sentiment Analysis Chatbot",
    category: "nlp",
    difficulty: "intermediate",
    estimatedHours: 6,
    tags: ["NLP", "Flask", "BERT", "Python", "Transformers"],

    overview:
      "Build a production-ready sentiment analysis chatbot using BERT transformer model. This project covers end-to-end ML deployment: from loading pre-trained models to building APIs and optimizing for real-time inference.",

    whatYouLearn: [
      "Load and use pre-trained BERT models with HuggingFace Transformers",
      "Build production REST APIs with Flask",
      "Optimize inference for real-time performance (batch processing, caching)",
      "Deploy ML models with Docker and cloud platforms",
      "Handle edge cases and error scenarios in production",
    ],

    prerequisites: [
      "Python basics (functions, classes, pip)",
      "Basic understanding of APIs (REST, JSON)",
      "Command line familiarity",
      "Optional: Basic ML concepts helpful but not required",
    ],

    tutorialSteps: [
      {
        title: "Project Setup & Environment",
        duration: 20,
        content: `## Step 1: Project Setup & Environment

### Learning Goals
- Set up a clean Python development environment
- Install and verify all required packages
- Understand the project structure

### Create Project Structure

\`\`\`bash
# Create project folder
mkdir sentiment-chatbot
cd sentiment-chatbot

# Create virtual environment (isolates dependencies)
python -m venv venv

# Activate virtual environment
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\\Scripts\\activate

# Your prompt should now show (venv)
\`\`\`

### Install Dependencies

\`\`\`bash
# Install required packages
pip install transformers torch flask pandas numpy

# Save dependencies for deployment later
pip freeze > requirements.txt
\`\`\`

### Verify Installation

Create a file called \`test_setup.py\`:

\`\`\`python
# test_setup.py - Verify all packages are installed correctly

import sys
print(f"Python version: {sys.version}")

import transformers
print(f"Transformers: {transformers.__version__}")

import torch
print(f"PyTorch: {torch.__version__}")

import flask
print(f"Flask: {flask.__version__}")

print("\\n✅ All packages installed successfully!")
print("You're ready to start building!")
\`\`\`

Run it:

\`\`\`bash
python test_setup.py
\`\`\`

### What You Just Did
- Created an isolated Python environment (best practice for any project)
- Installed HuggingFace Transformers (for BERT model)
- Installed PyTorch (deep learning backend)
- Installed Flask (web framework for our API)

### Pro Tip
Always use virtual environments! This prevents package conflicts between projects and makes deployment much easier.`,
      },
      {
        title: "Load & Test BERT Model",
        duration: 30,
        content: `## Step 2: Load & Test BERT Model

### Learning Goals
- Understand what BERT is and why it's powerful
- Load a pre-trained sentiment analysis model
- Run your first predictions

### What is BERT?
BERT (Bidirectional Encoder Representations from Transformers) is a powerful language model pre-trained on massive amounts of text. Instead of training from scratch (which requires millions of examples), we can use transfer learning - leveraging BERT's existing knowledge.

### Load the Model

Create \`model.py\`:

\`\`\`python
# model.py - Load and test the sentiment analysis model

from transformers import pipeline
import time

print("Loading model... (this may take 30-60 seconds first time)")
start = time.time()

# The pipeline automatically downloads and caches the model
# Default model: distilbert-base-uncased-finetuned-sst-2-english
classifier = pipeline('sentiment-analysis')

print(f"Model loaded in {time.time() - start:.1f} seconds")

# Test with sample texts
test_texts = [
    "I absolutely love this product! Best purchase ever!",
    "This is terrible. Complete waste of money.",
    "It's okay, nothing special but gets the job done.",
    "The customer service was incredibly helpful and friendly!",
    "Shipping took forever and the item arrived damaged."
]

print("\\n" + "="*50)
print("SENTIMENT ANALYSIS RESULTS")
print("="*50)

for text in test_texts:
    result = classifier(text)[0]
    emoji = "✅" if result['label'] == 'POSITIVE' else "❌"
    print(f"\\n{emoji} {result['label']} ({result['score']:.1%})")
    print(f'   "{text[:50]}..."' if len(text) > 50 else f'   "{text}"')
\`\`\`

Run it:

\`\`\`bash
python model.py
\`\`\`

### Expected Output

\`\`\`
Loading model... (this may take 30-60 seconds first time)
Model loaded in 45.2 seconds

==================================================
SENTIMENT ANALYSIS RESULTS
==================================================

✅ POSITIVE (99.9%)
   "I absolutely love this product! Best purchase ever!"

❌ NEGATIVE (99.8%)
   "This is terrible. Complete waste of money."

✅ POSITIVE (87.3%)
   "It's okay, nothing special but gets the job done."
...
\`\`\`

### Understanding the Output
- **label**: POSITIVE or NEGATIVE classification
- **score**: Confidence level (0.0 to 1.0)
- Notice the neutral text gets lower confidence - the model is uncertain

### Key Concepts
1. **Transfer Learning**: We're using a model pre-trained on movie reviews (SST-2 dataset)
2. **Pipeline API**: HuggingFace's simple interface that handles tokenization, inference, and post-processing
3. **Caching**: Model is downloaded once and cached locally (~250MB)

### Try It Yourself
Experiment with different texts! Try:
- Sarcasm ("Oh great, another meeting...")
- Mixed sentiment ("Good product but expensive")
- Different domains (restaurant reviews, tweets)`,
      },
      {
        title: "Build Flask REST API",
        duration: 45,
        content: `## Step 3: Build Flask REST API

### Learning Goals
- Create a production-ready REST API
- Handle JSON requests and responses
- Implement proper error handling

### Why Flask?
Flask is a lightweight Python web framework perfect for ML APIs:
- Simple and easy to understand
- Great for microservices
- Easy to deploy
- Large community and documentation

### Create the API

Create \`app.py\`:

\`\`\`python
# app.py - Flask REST API for sentiment analysis

from flask import Flask, request, jsonify
from transformers import pipeline
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Load model at startup (runs once)
logger.info("Loading sentiment analysis model...")
classifier = pipeline('sentiment-analysis')
logger.info("Model loaded successfully!")


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({
        'status': 'healthy',
        'model': 'sentiment-analysis'
    })


@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    """
    Analyze sentiment of provided text

    Request body:
        {"text": "Your text here"}

    Response:
        {"label": "POSITIVE/NEGATIVE", "score": 0.99, "text": "..."}
    """
    try:
        # Get JSON data from request
        data = request.get_json()

        # Validate input
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        text = data.get('text', '').strip()

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        if len(text) > 5000:
            return jsonify({'error': 'Text too long (max 5000 characters)'}), 400

        # Run inference
        result = classifier(text)[0]

        # Return formatted response
        return jsonify({
            'label': result['label'],
            'score': round(result['score'], 4),
            'text': text[:100] + '...' if len(text) > 100 else text
        })

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/analyze/batch', methods=['POST'])
def analyze_batch():
    """
    Analyze sentiment of multiple texts

    Request body:
        {"texts": ["text1", "text2", ...]}

    Response:
        {"results": [{"label": "...", "score": ...}, ...]}
    """
    try:
        data = request.get_json()

        if not data or 'texts' not in data:
            return jsonify({'error': 'No texts array provided'}), 400

        texts = data['texts']

        if not isinstance(texts, list) or len(texts) == 0:
            return jsonify({'error': 'texts must be a non-empty array'}), 400

        if len(texts) > 100:
            return jsonify({'error': 'Too many texts (max 100)'}), 400

        # Run batch inference (more efficient than one-by-one)
        results = classifier(texts)

        return jsonify({
            'results': [
                {
                    'label': r['label'],
                    'score': round(r['score'], 4),
                    'text': t[:50] + '...' if len(t) > 50 else t
                }
                for r, t in zip(results, texts)
            ],
            'count': len(results)
        })

    except Exception as e:
        logger.error(f"Error processing batch request: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    # Run development server
    app.run(host='0.0.0.0', port=5000, debug=True)
\`\`\`

### Run the Server

\`\`\`bash
python app.py
\`\`\`

You should see:

\`\`\`
INFO:__main__:Loading sentiment analysis model...
INFO:__main__:Model loaded successfully!
 * Running on http://0.0.0.0:5000
\`\`\`

### Test the API

Open a new terminal and test:

\`\`\`bash
# Test health endpoint
curl http://localhost:5000/health

# Test single analysis
curl -X POST http://localhost:5000/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"text": "This product is amazing! I love it!"}'

# Test batch analysis
curl -X POST http://localhost:5000/analyze/batch \\
  -H "Content-Type: application/json" \\
  -d '{"texts": ["Great service!", "Terrible experience", "It was okay"]}'
\`\`\`

### Expected Responses

Single analysis:
\`\`\`json
{
  "label": "POSITIVE",
  "score": 0.9998,
  "text": "This product is amazing! I love it!"
}
\`\`\`

Batch analysis:
\`\`\`json
{
  "results": [
    {"label": "POSITIVE", "score": 0.9998, "text": "Great service!"},
    {"label": "NEGATIVE", "score": 0.9995, "text": "Terrible experience"},
    {"label": "POSITIVE", "score": 0.8234, "text": "It was okay"}
  ],
  "count": 3
}
\`\`\`

### API Design Best Practices Used
1. **Health endpoint**: For monitoring and load balancers
2. **Input validation**: Check for missing/invalid data
3. **Error handling**: Return proper HTTP status codes
4. **Logging**: Track errors and requests
5. **Batch endpoint**: More efficient for multiple items`,
      },
      {
        title: "Optimize for Production",
        duration: 60,
        content: `## Step 4: Optimize for Production

### Learning Goals
- Implement caching to reduce redundant computations
- Add request timing and monitoring
- Optimize for concurrent users

### Why Optimization Matters
In production:
- Users expect fast responses (<500ms)
- Servers cost money (efficient = cheaper)
- Many users may query simultaneously

### Enhanced App with Optimizations

Update \`app.py\`:

\`\`\`python
# app.py - Production-optimized Flask API

from flask import Flask, request, jsonify, g
from transformers import pipeline
from functools import lru_cache
import hashlib
import time
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Load model once at startup
logger.info("Loading sentiment analysis model...")
classifier = pipeline('sentiment-analysis')
logger.info("Model loaded successfully!")

# Simple in-memory cache for demo (use Redis in production)
cache = {}
CACHE_MAX_SIZE = 1000


def get_cache_key(text: str) -> str:
    """Create a hash key for caching"""
    return hashlib.md5(text.lower().strip().encode()).hexdigest()


def get_cached_result(text: str):
    """Get result from cache if exists"""
    key = get_cache_key(text)
    return cache.get(key)


def set_cached_result(text: str, result: dict):
    """Store result in cache"""
    if len(cache) >= CACHE_MAX_SIZE:
        # Simple eviction: remove oldest 10%
        keys_to_remove = list(cache.keys())[:CACHE_MAX_SIZE // 10]
        for k in keys_to_remove:
            del cache[k]
    cache[get_cache_key(text)] = result


@app.before_request
def start_timer():
    """Record request start time"""
    g.start_time = time.time()


@app.after_request
def log_request(response):
    """Log request duration"""
    if hasattr(g, 'start_time'):
        duration = (time.time() - g.start_time) * 1000
        logger.info(f"{request.method} {request.path} - {response.status_code} - {duration:.1f}ms")
    return response


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'cache_size': len(cache),
        'cache_max': CACHE_MAX_SIZE
    })


@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        text = data.get('text', '').strip()

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        if len(text) > 5000:
            return jsonify({'error': 'Text too long (max 5000 chars)'}), 400

        # Check cache first
        cached = get_cached_result(text)
        if cached:
            return jsonify({**cached, 'cached': True})

        # Run inference
        start = time.time()
        result = classifier(text)[0]
        inference_time = (time.time() - start) * 1000

        response = {
            'label': result['label'],
            'score': round(result['score'], 4),
            'text': text[:100] + '...' if len(text) > 100 else text,
            'inference_ms': round(inference_time, 1),
            'cached': False
        }

        # Cache the result
        set_cached_result(text, {
            'label': response['label'],
            'score': response['score'],
            'text': response['text']
        })

        return jsonify(response)

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/analyze/batch', methods=['POST'])
def analyze_batch():
    try:
        data = request.get_json()

        if not data or 'texts' not in data:
            return jsonify({'error': 'No texts array provided'}), 400

        texts = data['texts']

        if not isinstance(texts, list) or len(texts) == 0:
            return jsonify({'error': 'texts must be a non-empty array'}), 400

        if len(texts) > 100:
            return jsonify({'error': 'Too many texts (max 100)'}), 400

        results = []
        texts_to_process = []
        indices_to_process = []

        # Check cache for each text
        for i, text in enumerate(texts):
            cached = get_cached_result(text)
            if cached:
                results.append({**cached, 'cached': True})
            else:
                results.append(None)  # Placeholder
                texts_to_process.append(text)
                indices_to_process.append(i)

        # Batch process uncached texts
        if texts_to_process:
            start = time.time()
            batch_results = classifier(texts_to_process)
            inference_time = (time.time() - start) * 1000

            for idx, (br, text) in zip(indices_to_process, zip(batch_results, texts_to_process)):
                result = {
                    'label': br['label'],
                    'score': round(br['score'], 4),
                    'text': text[:50] + '...' if len(text) > 50 else text,
                    'cached': False
                }
                results[idx] = result
                set_cached_result(text, result)

        cache_hits = sum(1 for r in results if r.get('cached'))

        return jsonify({
            'results': results,
            'count': len(results),
            'cache_hits': cache_hits,
            'processed': len(texts_to_process)
        })

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/stats', methods=['GET'])
def get_stats():
    """Return API statistics"""
    return jsonify({
        'cache_size': len(cache),
        'cache_max_size': CACHE_MAX_SIZE,
        'cache_utilization': f"{len(cache)/CACHE_MAX_SIZE*100:.1f}%"
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
\`\`\`

### Test the Optimizations

\`\`\`bash
# First request (cache miss)
curl -X POST http://localhost:5000/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"text": "This is great!"}'
# Note: "cached": false, "inference_ms": ~100

# Second request (cache hit - should be instant)
curl -X POST http://localhost:5000/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"text": "This is great!"}'
# Note: "cached": true, much faster!

# Check stats
curl http://localhost:5000/stats
\`\`\`

### Performance Comparison

| Scenario | Without Cache | With Cache |
|----------|---------------|------------|
| First request | ~100-200ms | ~100-200ms |
| Repeated request | ~100-200ms | <10ms |
| Batch (10 items) | ~300-500ms | Depends on hits |

### Optimizations Implemented
1. **In-memory caching**: Skip inference for repeated queries
2. **Request timing**: Log how long each request takes
3. **Cache statistics**: Monitor cache utilization
4. **Batch optimization**: Process multiple texts efficiently

### Production Note
For real production, replace the simple cache with Redis:
\`\`\`python
import redis
r = redis.Redis(host='localhost', port=6379, db=0)
\`\`\``,
      },
      {
        title: "Add Chat Interface",
        duration: 45,
        content: `## Step 5: Add Chat Interface

### Learning Goals
- Create a simple but professional web interface
- Connect frontend to your API
- Handle user interactions

### Create the Frontend

Create \`templates/index.html\`:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sentiment Analysis Chatbot</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 600px;
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }

        .header p {
            opacity: 0.9;
            font-size: 14px;
        }

        .chat-area {
            height: 400px;
            overflow-y: auto;
            padding: 20px;
            background: #f8f9fa;
        }

        .message {
            margin-bottom: 15px;
            display: flex;
            flex-direction: column;
        }

        .message.user {
            align-items: flex-end;
        }

        .message.bot {
            align-items: flex-start;
        }

        .bubble {
            max-width: 80%;
            padding: 12px 18px;
            border-radius: 18px;
            font-size: 15px;
            line-height: 1.4;
        }

        .user .bubble {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-bottom-right-radius: 4px;
        }

        .bot .bubble {
            background: white;
            color: #333;
            border-bottom-left-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .sentiment-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 8px;
        }

        .positive {
            background: #d4edda;
            color: #155724;
        }

        .negative {
            background: #f8d7da;
            color: #721c24;
        }

        .input-area {
            padding: 20px;
            background: white;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
        }

        #textInput {
            flex: 1;
            padding: 15px 20px;
            border: 2px solid #e9ecef;
            border-radius: 25px;
            font-size: 15px;
            outline: none;
            transition: border-color 0.3s;
        }

        #textInput:focus {
            border-color: #667eea;
        }

        #sendBtn {
            padding: 15px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        #sendBtn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }

        #sendBtn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .typing {
            display: flex;
            gap: 4px;
            padding: 8px 0;
        }

        .typing span {
            width: 8px;
            height: 8px;
            background: #667eea;
            border-radius: 50%;
            animation: typing 1s infinite;
        }

        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
            0%, 100% { opacity: 0.3; transform: translateY(0); }
            50% { opacity: 1; transform: translateY(-4px); }
        }

        .stats {
            font-size: 11px;
            color: #888;
            margin-top: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Sentiment Analysis Chatbot</h1>
            <p>Enter any text and I'll analyze its sentiment</p>
        </div>

        <div class="chat-area" id="chatArea">
            <div class="message bot">
                <div class="bubble">
                    Hello! I can analyze the sentiment of any text you provide.
                    Try typing a review, comment, or any text!
                </div>
            </div>
        </div>

        <div class="input-area">
            <input
                type="text"
                id="textInput"
                placeholder="Type something to analyze..."
                autocomplete="off"
            >
            <button id="sendBtn">Analyze</button>
        </div>
    </div>

    <script>
        const chatArea = document.getElementById('chatArea');
        const textInput = document.getElementById('textInput');
        const sendBtn = document.getElementById('sendBtn');

        function addMessage(text, isUser = false) {
            const div = document.createElement('div');
            div.className = \`message \${isUser ? 'user' : 'bot'}\`;
            div.innerHTML = \`<div class="bubble">\${text}</div>\`;
            chatArea.appendChild(div);
            chatArea.scrollTop = chatArea.scrollHeight;
            return div;
        }

        function addTypingIndicator() {
            const div = document.createElement('div');
            div.className = 'message bot';
            div.id = 'typing';
            div.innerHTML = \`
                <div class="bubble">
                    <div class="typing">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            \`;
            chatArea.appendChild(div);
            chatArea.scrollTop = chatArea.scrollHeight;
        }

        function removeTypingIndicator() {
            const typing = document.getElementById('typing');
            if (typing) typing.remove();
        }

        function formatResult(result) {
            const isPositive = result.label === 'POSITIVE';
            const emoji = isPositive ? '😊' : '😔';
            const badgeClass = isPositive ? 'positive' : 'negative';
            const percentage = (result.score * 100).toFixed(1);

            let response = \`<strong>\${emoji} \${result.label}</strong><br>\`;
            response += \`Confidence: \${percentage}%\`;
            response += \`<div class="sentiment-badge \${badgeClass}">\${result.label}</div>\`;

            if (result.inference_ms) {
                response += \`<div class="stats">Response time: \${result.inference_ms}ms\${result.cached ? ' (cached)' : ''}</div>\`;
            }

            return response;
        }

        async function analyze() {
            const text = textInput.value.trim();
            if (!text) return;

            // Add user message
            addMessage(text, true);
            textInput.value = '';
            sendBtn.disabled = true;

            // Show typing indicator
            addTypingIndicator();

            try {
                const response = await fetch('/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text })
                });

                const result = await response.json();

                removeTypingIndicator();

                if (result.error) {
                    addMessage(\`Error: \${result.error}\`);
                } else {
                    addMessage(formatResult(result));
                }
            } catch (error) {
                removeTypingIndicator();
                addMessage('Sorry, something went wrong. Please try again.');
            }

            sendBtn.disabled = false;
            textInput.focus();
        }

        sendBtn.addEventListener('click', analyze);
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') analyze();
        });

        textInput.focus();
    </script>
</body>
</html>
\`\`\`

### Update Flask to Serve the Frontend

Add to \`app.py\`:

\`\`\`python
from flask import render_template

# Add this route before if __name__ == '__main__':
@app.route('/')
def home():
    return render_template('index.html')
\`\`\`

### Test the Interface

\`\`\`bash
# Make sure templates folder exists
mkdir -p templates

# Run the app
python app.py
\`\`\`

Visit http://localhost:5000 in your browser!

### What You Built
- Modern, responsive chat interface
- Real-time sentiment analysis
- Visual feedback with colors and emojis
- Performance stats display
- Typing indicator for better UX`,
      },
      {
        title: "Deploy to Production",
        duration: 60,
        content: `## Step 6: Deploy to Production

### Learning Goals
- Containerize application with Docker
- Deploy to cloud platform
- Set up production-grade server

### Create Dockerfile

\`\`\`dockerfile
# Dockerfile

# Use Python slim image for smaller size
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Download model during build (not at runtime)
RUN python -c "from transformers import pipeline; pipeline('sentiment-analysis')"

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Use Gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120", "app:app"]
\`\`\`

### Update requirements.txt

\`\`\`text
flask==2.3.0
transformers==4.35.0
torch==2.1.0
gunicorn==21.2.0
\`\`\`

### Create .dockerignore

\`\`\`text
venv/
__pycache__/
*.pyc
.git/
.env
*.md
\`\`\`

### Build and Run Locally

\`\`\`bash
# Build the image
docker build -t sentiment-chatbot .

# Run the container
docker run -p 5000:5000 sentiment-chatbot

# Test it
curl http://localhost:5000/health
\`\`\`

### Deploy to Railway (Recommended for Beginners)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub**
   \`\`\`bash
   # Push to GitHub first
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   \`\`\`

3. **Connect to Railway**
   - Click "New Project" in Railway
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects Dockerfile and deploys

4. **Get Your URL**
   - Railway provides a public URL
   - Example: https://sentiment-chatbot-production.up.railway.app

### Alternative: Deploy to Render

1. Create account at [render.com](https://render.com)
2. New → Web Service → Connect GitHub repo
3. Configure:
   - Build Command: (leave blank, uses Dockerfile)
   - Start Command: (leave blank, uses Dockerfile)
4. Deploy!

### Production Checklist

- [x] Dockerfile created
- [x] Gunicorn for production server
- [x] Model pre-downloaded in Docker image
- [x] Health check endpoint
- [x] Error handling
- [x] Logging configured
- [ ] Environment variables for secrets
- [ ] HTTPS (provided by Railway/Render)
- [ ] Rate limiting (add later)

### Test Your Production Deployment

\`\`\`bash
# Replace with your actual URL
export API_URL="https://your-app.railway.app"

# Health check
curl $API_URL/health

# Test analysis
curl -X POST $API_URL/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"text": "This deployed app is awesome!"}'
\`\`\`

### Congratulations!
You now have a production ML application running in the cloud! Share the URL with friends and colleagues.

### Next Steps
- Add authentication (API keys)
- Set up monitoring (Datadog, New Relic)
- Add rate limiting
- Implement A/B testing for models`,
      },
    ],

    resumeBullets: {
      technical: [
        "Built real-time sentiment analysis API using Python, Flask, and fine-tuned DistilBERT transformer achieving 91% F1-score on SST-2 benchmark",
        "Implemented intelligent caching layer reducing average response time from 150ms to <20ms for repeated queries, handling 100+ concurrent users",
        "Designed RESTful API with batch processing endpoint improving throughput by 3x for bulk sentiment classification tasks",
        "Deployed containerized application on AWS/Railway with Gunicorn workers and automated CI/CD pipeline using Docker",
      ],
      impact: [
        "Developed NLP microservice enabling real-time customer feedback analysis, processing 10,000+ daily requests with 99.9% uptime",
        "Reduced sentiment classification latency by 85% through strategic caching and model optimization techniques",
        "Created production-ready ML system with comprehensive error handling, logging, and monitoring for reliable operation",
        "Delivered end-to-end solution from model selection through deployment, demonstrating full ML lifecycle ownership",
      ],
      fullStack: [
        "Architected full-stack sentiment analysis application with Flask REST backend, responsive web chat interface, and containerized deployment",
        "Integrated HuggingFace Transformers with custom preprocessing pipeline achieving sub-200ms end-to-end response time",
        "Built interactive chat UI with real-time sentiment visualization, typing indicators, and performance metrics display",
        "Managed complete DevOps pipeline including Docker containerization, cloud deployment, and production monitoring",
      ],
    },

    interviewQA: [
      {
        id: "q1-tell-me-about",
        question: "Tell me about this project. What did you build and why?",
        starAnswer: {
          situation:
            "I wanted to build a practical NLP application that demonstrates end-to-end ML engineering skills - not just training a model in a notebook, but deploying something that real users could interact with. I chose sentiment analysis because it's immediately useful and easy to demonstrate, but the architecture applies to any text classification task.",
          task: "My goal was to create a production-ready system that could analyze text sentiment in real-time. Key requirements included: fast response times (<200ms), ability to handle concurrent users, a clean API for integration, and a user-friendly chat interface for demos.",
          action:
            "I built the system in layers: First, I used HuggingFace Transformers to load a pre-trained DistilBERT model fine-tuned on sentiment data. Then I created a Flask REST API with proper error handling, input validation, and both single and batch endpoints. To optimize performance, I implemented an in-memory caching layer that dramatically reduced response times for repeated queries. Finally, I built a chat interface and containerized everything with Docker for deployment.",
          result:
            "The final system achieves 91% accuracy, responds in under 200ms (under 20ms for cached queries), and handles 100+ concurrent users. I deployed it on Railway where it processes thousands of requests. The project demonstrates the full ML engineering lifecycle: model selection, API design, optimization, frontend integration, and production deployment.",
        },
        keyPoints: [
          "End-to-end ownership: model → API → frontend → deployment",
          "Production mindset: performance, reliability, monitoring",
          "Practical trade-offs: chose DistilBERT over full BERT for speed",
          "Quantifiable results: latency, accuracy, throughput metrics",
        ],
      },
      {
        id: "q2-technical-decisions",
        question:
          "Walk me through your key technical decisions. Why Flask? Why that specific model?",
        starAnswer: {
          situation:
            "For any ML project, there are multiple valid technology choices. I had to make decisions about the model, web framework, and deployment approach that balanced performance, simplicity, and my learning goals.",
          task: "I needed to choose technologies that would work well together, be appropriate for the use case, and be maintainable. I also wanted to use industry-standard tools that would be relevant for real jobs.",
          action:
            "For the model, I chose DistilBERT over full BERT because it's 60% faster with only 3% accuracy drop - a great trade-off for real-time applications. I used HuggingFace's pipeline API because it handles tokenization and post-processing automatically, reducing bugs. For the web framework, I chose Flask over FastAPI because Flask is more widely used in production and the async benefits of FastAPI aren't needed when the bottleneck is model inference anyway. For deployment, Docker ensures consistency between development and production, and Railway provides free hosting with automatic HTTPS.",
          result:
            "These choices led to a system that's fast, maintainable, and uses technologies that interviewers will recognize. The whole stack is common in industry: Python, Flask, Docker, and cloud deployment are used by most ML teams.",
        },
        keyPoints: [
          "Trade-off thinking: speed vs accuracy, simplicity vs features",
          "Industry awareness: chose common, well-supported tools",
          "Practical reasoning: async not needed when GPU is bottleneck",
          "Learning orientation: chose tools relevant to career goals",
        ],
      },
      {
        id: "q3-optimization",
        question:
          "What was the biggest performance challenge and how did you solve it?",
        starAnswer: {
          situation:
            "The initial version of my API had 150ms+ response times for every request. While acceptable for occasional use, this would be too slow for a production chat interface where users expect instant responses, and it would also drive up costs with heavy usage.",
          task: "I needed to significantly reduce response times while maintaining accuracy. My target was under 50ms for most requests, and I wanted the system to get faster with usage (a 'warm cache' effect).",
          action:
            "I implemented a multi-layer optimization strategy. First, I added an in-memory cache using MD5 hashing of input text - this gives instant responses for repeated queries. Second, I added a batch endpoint so clients can send multiple texts in one request, reducing network overhead. Third, I pre-loaded the model at startup rather than on first request. I measured each optimization's impact using timing middleware that logs every request.",
          result:
            "Cache hits now return in under 20ms - an 85% improvement. The batch endpoint processes 10 texts in roughly the same time as 3 individual requests. The cache hit rate in production is around 30%, meaning nearly a third of requests are nearly instant. For users, the chat interface feels responsive and snappy.",
        },
        keyPoints: [
          "Systematic approach: measured before and after each change",
          "Multiple strategies: caching, batching, preloading",
          "Quantifiable results: 85% latency reduction, 30% cache hit rate",
          "User-centric thinking: fast enough for interactive use",
        ],
      },
      {
        id: "q4-production-issues",
        question:
          "If you deployed this at scale, what issues would you anticipate? How would you address them?",
        starAnswer: {
          situation:
            "The current implementation works well for moderate traffic, but scaling to thousands or millions of requests would expose several limitations in my simple architecture.",
          task: "I need to think through bottlenecks at scale: memory limits, single-server limitations, cold start issues, and monitoring gaps.",
          action:
            "I'd address these systematically. For memory, I'd replace the in-memory cache with Redis - this allows cache sharing across multiple server instances and survives restarts. For throughput, I'd add horizontal scaling with a load balancer distributing requests across multiple containers, each with 2-3 Gunicorn workers. For cold starts (first request after scaling up), I'd implement model warming - hitting the inference endpoint during container startup. For reliability, I'd add Prometheus metrics for latency percentiles, error rates, and cache hit ratios, with alerts when they degrade. I'd also add rate limiting to protect against abuse and ensure fair resource usage.",
          result:
            "This architecture could handle 10-100x more traffic. Redis handles millions of cached entries, horizontal scaling adds linear capacity, and monitoring ensures we catch issues before users do. These are standard patterns I've seen in production ML systems.",
        },
        keyPoints: [
          "Anticipates real problems: memory, cold starts, monitoring",
          "Practical solutions: Redis, horizontal scaling, health checks",
          "Industry patterns: load balancing, rate limiting, observability",
          "Growth mindset: current system works, knows how to scale it",
        ],
      },
      {
        id: "q5-model-evaluation",
        question:
          "How did you evaluate your model's performance? What metrics did you use?",
        starAnswer: {
          situation:
            "Using a pre-trained model doesn't mean blindly trusting it. I needed to understand how well it actually performs on the types of text my users would submit, and track both model quality and system performance.",
          task: "I wanted to establish confidence in the model's accuracy while also monitoring the system's operational metrics. Both matter for a production system.",
          action:
            "For model quality, I evaluated on the SST-2 benchmark (Stanford Sentiment Treebank) where the model achieves 91% F1-score. I also manually tested on 50 diverse examples including edge cases like sarcasm ('Oh great, another meeting'), mixed sentiment ('Good product but expensive'), and domain-specific text (tech reviews). For system metrics, I track P50, P95, and P99 latencies, requests per second, error rates, and cache hit ratios. I log every request with timing information for analysis.",
          result:
            "The model handles straightforward sentiment well but struggles with sarcasm and nuanced text - this is a known limitation I'd document for users. System metrics show P95 latency under 100ms, which meets my target. The cache hit rate of 30% significantly reduces average response time.",
        },
        keyPoints: [
          "Multiple evaluation methods: benchmarks + manual testing",
          "Knows model limitations: sarcasm, nuance, domain specificity",
          "Operational metrics: latency percentiles, not just averages",
          "Honest assessment: acknowledges what model can't do well",
        ],
      },
      {
        id: "q6-what-learned",
        question:
          "What did you learn from this project? What would you do differently?",
        starAnswer: {
          situation:
            "This project taught me a lot about the gap between 'model works in notebook' and 'model works in production.' Several things surprised me along the way.",
          task: "I want to reflect honestly on what I learned and how I'd improve with the knowledge I have now.",
          action:
            "Key learnings: First, model loading time matters a lot - the 30-second startup was fine for development but would be terrible for auto-scaling. Pre-downloading in Docker fixed this. Second, caching is incredibly powerful - a simple cache gave me bigger latency improvements than any model optimization would have. Third, good error messages save debugging time - investing in clear error responses early paid off when testing edge cases. If starting over, I'd use FastAPI instead of Flask for better automatic documentation and type hints. I'd also add structured logging from the start (JSON format) to make log analysis easier. And I'd set up proper CI/CD earlier rather than manual deployments.",
          result:
            "These learnings apply to any ML project, not just sentiment analysis. The biggest insight is that production ML is 20% model work and 80% engineering - deployment, monitoring, error handling, and optimization are where most of the effort goes.",
        },
        keyPoints: [
          "Honest reflection: admits what surprised them",
          "Practical learnings: caching, error handling, startup time",
          "Improvement ideas: FastAPI, structured logging, CI/CD",
          "Industry insight: production ML is mostly engineering",
        ],
      },
    ],
  },
};

// Project 2: Image Classification API
const IMAGE_CLASSIFIER: ProjectTemplate = {
  id: "image-classifier",
  title: "Image Classification API",
  category: "cv",
  difficulty: "beginner",
  estimatedHours: 4,
  tags: ["Computer Vision", "FastAPI", "PyTorch", "ResNet"],

  overview:
    "Build an image classification API using pre-trained ResNet model with FastAPI.",

  whatYouLearn: [
    "Computer vision basics",
    "Transfer learning with pre-trained models",
    "FastAPI for ML serving",
    "Image preprocessing pipelines",
  ],

  prerequisites: ["Python basics", "Basic understanding of neural networks"],

  tutorialSteps: [
    {
      title: "Environment Setup",
      duration: 15,
      content: `## Step 1: Environment Setup (15 minutes)

Set up your development environment.

\`\`\`bash
python -m venv venv
source venv/bin/activate

pip install torch torchvision fastapi uvicorn pillow python-multipart
\`\`\`

Mark complete when environment is ready.`,
    },
    {
      title: "Load Pre-trained Model",
      duration: 20,
      content: `## Step 2: Load Pre-trained Model (20 minutes)

Load ResNet50 pre-trained on ImageNet.

\`\`\`python
import torch
from torchvision import models, transforms

# Load pre-trained model
model = models.resnet50(pretrained=True)
model.eval()

# Define preprocessing
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])
\`\`\`

Mark complete when model loads successfully.`,
    },
    {
      title: "Build FastAPI Endpoint",
      duration: 30,
      content: `## Step 3: Build FastAPI Endpoint (30 minutes)

Create the API server.

\`\`\`python
from fastapi import FastAPI, UploadFile, File
from PIL import Image
import io

app = FastAPI()

@app.post("/classify")
async def classify_image(file: UploadFile = File(...)):
    # Read and preprocess image
    image = Image.open(io.BytesIO(await file.read()))
    input_tensor = preprocess(image).unsqueeze(0)

    # Run inference
    with torch.no_grad():
        output = model(input_tensor)
        probabilities = torch.nn.functional.softmax(output[0], dim=0)

    # Get top 5 predictions
    top5_prob, top5_catid = torch.topk(probabilities, 5)

    return {
        "predictions": [
            {"class_id": int(catid), "probability": float(prob)}
            for prob, catid in zip(top5_prob, top5_catid)
        ]
    }
\`\`\`

Mark complete when API returns predictions.`,
    },
    {
      title: "Add Class Labels",
      duration: 20,
      content: `## Step 4: Add Human-Readable Labels (20 minutes)

Map class IDs to ImageNet labels.

\`\`\`python
# Download ImageNet labels
import urllib.request
import json

LABELS_URL = "https://raw.githubusercontent.com/pytorch/hub/master/imagenet_classes.txt"

with urllib.request.urlopen(LABELS_URL) as f:
    categories = [s.strip().decode('utf-8') for s in f.readlines()]

# Update endpoint to return labels
return {
    "predictions": [
        {
            "label": categories[int(catid)],
            "probability": float(prob)
        }
        for prob, catid in zip(top5_prob, top5_catid)
    ]
}
\`\`\`

Mark complete when labels appear in response.`,
    },
    {
      title: "Test and Document",
      duration: 30,
      content: `## Step 5: Test and Document (30 minutes)

Test with sample images and create documentation.

### Run server
\`\`\`bash
uvicorn main:app --reload
\`\`\`

### Test with curl
\`\`\`bash
curl -X POST "http://localhost:8000/classify" \\
  -F "file=@test_image.jpg"
\`\`\`

### View auto-generated docs
Visit http://localhost:8000/docs

Mark complete when all tests pass.`,
    },
    {
      title: "Deploy to Cloud",
      duration: 45,
      content: `## Step 6: Deploy to Cloud (45 minutes)

Deploy using Docker and a cloud platform.

### Dockerfile
\`\`\`dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

Mark complete when deployed and accessible.`,
    },
  ],

  resumeBullets: {
    technical: [
      "Built image classification API using PyTorch and FastAPI with pre-trained ResNet50 model",
      "Implemented efficient image preprocessing pipeline with batch inference support",
      "Achieved 94% top-5 accuracy on ImageNet validation set with <100ms inference time",
      "Deployed containerized service on AWS with auto-scaling for production workloads",
    ],
    impact: [
      "Developed computer vision API enabling real-time image classification for product categorization",
      "Reduced image processing time by 60% through GPU acceleration and optimized preprocessing",
      "Created scalable microservice architecture handling 1000+ classification requests per minute",
      "Delivered production ML system with comprehensive API documentation and monitoring",
    ],
    fullStack: [
      "Architected end-to-end image classification service with FastAPI backend and REST interface",
      "Integrated PyTorch deep learning model with async request handling for high throughput",
      "Implemented complete CI/CD pipeline with Docker containerization and cloud deployment",
      "Built auto-generated API documentation with Swagger UI for seamless integration",
    ],
  },

  interviewQA: [
    {
      id: "cv-q1-project",
      question: "Tell me about this computer vision project",
      starAnswer: {
        situation:
          "I wanted to build a practical computer vision application that could be used in production for image classification tasks.",
        task: "The goal was to create a fast, reliable API that could classify images in real-time while being easy to integrate into other applications.",
        action:
          "I used transfer learning with a pre-trained ResNet50 model, built a FastAPI server for efficient request handling, and implemented proper image preprocessing. I also added comprehensive error handling and API documentation.",
        result:
          "The final API achieved 94% top-5 accuracy with sub-100ms response times, and the auto-generated documentation made it easy for other developers to integrate.",
      },
      keyPoints: [
        "Transfer learning for efficiency",
        "Production-ready API design",
        "Documentation importance",
        "Performance metrics",
      ],
    },
    {
      id: "cv-q2-transfer",
      question:
        "Why did you use transfer learning instead of training from scratch?",
      starAnswer: {
        situation:
          "Training a deep CNN from scratch requires millions of labeled images and significant compute resources.",
        task: "I needed to build an accurate classifier quickly without access to massive datasets or GPU clusters.",
        action:
          "I used ResNet50 pre-trained on ImageNet, which has learned general visual features from 1.2 million images. These features transfer well to most image classification tasks.",
        result:
          "This approach gave me 94% accuracy immediately, whereas training from scratch would have taken weeks and likely achieved worse results with limited data.",
      },
      keyPoints: [
        "Understanding of transfer learning",
        "Resource constraints awareness",
        "Practical ML thinking",
        "Trade-off analysis",
      ],
    },
    {
      id: "cv-q3-scale",
      question: "How would you scale this for higher traffic?",
      starAnswer: {
        situation:
          "The current implementation handles moderate traffic but would need optimization for production scale.",
        task: "I needed to think about handling 10x or 100x more requests efficiently.",
        action:
          "I would implement: GPU batching to process multiple images together, model quantization to reduce memory, horizontal scaling with Kubernetes, and a CDN for frequently requested images. I'd also add request queuing with Redis.",
        result:
          "These optimizations could theoretically scale the system to handle thousands of requests per second while keeping latency acceptable.",
      },
      keyPoints: [
        "Scaling strategies",
        "GPU optimization",
        "Infrastructure knowledge",
        "Practical scaling experience",
      ],
    },
  ],
};

// Project 3: Recommendation System
const RECOMMENDATION_SYSTEM: ProjectTemplate = {
  id: "recommendation-system",
  title: "Movie Recommendation Engine",
  category: "data",
  difficulty: "intermediate",
  estimatedHours: 8,
  tags: ["Collaborative Filtering", "Matrix Factorization", "Python", "Pandas"],

  overview:
    "Build a movie recommendation system using collaborative filtering and matrix factorization.",

  whatYouLearn: [
    "Recommendation algorithms",
    "Collaborative filtering techniques",
    "Matrix factorization (SVD)",
    "Evaluation metrics for recommendations",
  ],

  prerequisites: [
    "Python and Pandas",
    "Linear algebra basics",
    "Basic statistics",
  ],

  tutorialSteps: [
    {
      title: "Data Preparation",
      duration: 30,
      content: `## Step 1: Data Preparation (30 minutes)

Download and explore the MovieLens dataset.

\`\`\`python
import pandas as pd
import numpy as np

# Load MovieLens 100K dataset
ratings = pd.read_csv('ratings.csv')
movies = pd.read_csv('movies.csv')

print(f"Ratings: {len(ratings)}")
print(f"Users: {ratings['userId'].nunique()}")
print(f"Movies: {ratings['movieId'].nunique()}")

# Create user-item matrix
user_item_matrix = ratings.pivot(
    index='userId',
    columns='movieId',
    values='rating'
).fillna(0)
\`\`\`

Mark complete when data is loaded and explored.`,
    },
    {
      title: "Implement User-Based CF",
      duration: 45,
      content: `## Step 2: User-Based Collaborative Filtering (45 minutes)

Find similar users and recommend based on their preferences.

\`\`\`python
from sklearn.metrics.pairwise import cosine_similarity

# Calculate user similarity
user_similarity = cosine_similarity(user_item_matrix)
user_sim_df = pd.DataFrame(
    user_similarity,
    index=user_item_matrix.index,
    columns=user_item_matrix.index
)

def get_similar_users(user_id, n=10):
    similar_users = user_sim_df[user_id].sort_values(ascending=False)[1:n+1]
    return similar_users

def recommend_user_based(user_id, n_recommendations=10):
    similar_users = get_similar_users(user_id)
    # Weight ratings by similarity
    weighted_ratings = user_item_matrix.loc[similar_users.index].mul(
        similar_users.values, axis=0
    ).sum() / similar_users.sum()
    # Filter out already rated
    user_rated = user_item_matrix.loc[user_id]
    recommendations = weighted_ratings[user_rated == 0].sort_values(ascending=False)
    return recommendations.head(n_recommendations)
\`\`\`

Mark complete when recommendations work.`,
    },
    {
      title: "Implement Matrix Factorization",
      duration: 60,
      content: `## Step 3: Matrix Factorization with SVD (60 minutes)

Use SVD for more accurate recommendations.

\`\`\`python
from scipy.sparse.linalg import svds

# Normalize the matrix
user_ratings_mean = np.mean(user_item_matrix.values, axis=1)
matrix_normalized = user_item_matrix.values - user_ratings_mean.reshape(-1, 1)

# SVD decomposition
U, sigma, Vt = svds(matrix_normalized, k=50)
sigma = np.diag(sigma)

# Reconstruct predictions
predicted_ratings = np.dot(np.dot(U, sigma), Vt) + user_ratings_mean.reshape(-1, 1)
predictions_df = pd.DataFrame(
    predicted_ratings,
    columns=user_item_matrix.columns,
    index=user_item_matrix.index
)

def recommend_svd(user_id, n_recommendations=10):
    user_pred = predictions_df.loc[user_id]
    user_rated = user_item_matrix.loc[user_id]
    recommendations = user_pred[user_rated == 0].sort_values(ascending=False)
    return recommendations.head(n_recommendations)
\`\`\`

Mark complete when SVD recommendations work.`,
    },
    {
      title: "Evaluate Models",
      duration: 45,
      content: `## Step 4: Evaluate Models (45 minutes)

Compare different recommendation approaches.

\`\`\`python
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

# Split data
train, test = train_test_split(ratings, test_size=0.2, random_state=42)

def calculate_rmse(predictions, test_data):
    # Match predictions with test ratings
    pred_values = []
    actual_values = []
    for _, row in test_data.iterrows():
        try:
            pred = predictions.loc[row['userId'], row['movieId']]
            pred_values.append(pred)
            actual_values.append(row['rating'])
        except KeyError:
            continue
    return np.sqrt(mean_squared_error(actual_values, pred_values))

rmse = calculate_rmse(predictions_df, test)
print(f"SVD RMSE: {rmse:.4f}")
\`\`\`

Mark complete when you have evaluation metrics.`,
    },
    {
      title: "Build API",
      duration: 45,
      content: `## Step 5: Build Recommendation API (45 minutes)

Create an API to serve recommendations.

\`\`\`python
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/recommend/<int:user_id>')
def get_recommendations(user_id):
    try:
        recs = recommend_svd(user_id, n_recommendations=10)
        movie_ids = recs.index.tolist()
        movie_titles = movies[movies['movieId'].isin(movie_ids)]['title'].tolist()
        return jsonify({
            'user_id': user_id,
            'recommendations': movie_titles
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
\`\`\`

Mark complete when API returns recommendations.`,
    },
    {
      title: "Add Hybrid Approach",
      duration: 60,
      content: `## Step 6: Hybrid Recommendation (60 minutes)

Combine collaborative filtering with content-based features.

\`\`\`python
from sklearn.feature_extraction.text import TfidfVectorizer

# Content-based features from movie genres
tfidf = TfidfVectorizer(stop_words='english')
movies['genres_str'] = movies['genres'].str.replace('|', ' ')
genre_matrix = tfidf.fit_transform(movies['genres_str'])

# Combine scores
def hybrid_recommend(user_id, n=10, cf_weight=0.7):
    cf_scores = recommend_svd(user_id, n=50)
    # Add content similarity boost
    # ... implementation
    return combined_recommendations
\`\`\`

Mark complete when hybrid model improves results.`,
    },
  ],

  resumeBullets: {
    technical: [
      "Built movie recommendation system using collaborative filtering and matrix factorization (SVD) on MovieLens dataset",
      "Implemented user-based and item-based collaborative filtering with cosine similarity achieving 0.89 RMSE",
      "Developed hybrid recommendation engine combining collaborative filtering with content-based features",
      "Created REST API serving personalized recommendations with <50ms latency for 100K+ users",
    ],
    impact: [
      "Developed recommendation engine improving content discovery by 35% based on user engagement metrics",
      "Implemented scalable matrix factorization reducing recommendation computation time by 80%",
      "Built personalization system serving millions of recommendations daily with high relevance scores",
      "Created A/B testing framework to measure recommendation quality and iterate on algorithms",
    ],
    fullStack: [
      "Architected end-to-end recommendation platform from data pipeline to production API",
      "Implemented real-time and batch recommendation modes for different use cases",
      "Built comprehensive evaluation framework with RMSE, precision@k, and diversity metrics",
      "Deployed recommendation service with Redis caching and horizontal scaling on AWS",
    ],
  },

  interviewQA: [
    {
      id: "rec-q1-approach",
      question: "Explain your recommendation approach",
      starAnswer: {
        situation:
          "I built a recommendation system for movies using the MovieLens dataset with 100K ratings.",
        task: "The goal was to provide personalized movie recommendations that users would actually enjoy.",
        action:
          "I implemented multiple approaches: user-based collaborative filtering to find similar users, SVD matrix factorization for latent factor discovery, and a hybrid approach combining CF with content features. I evaluated using RMSE and precision@k.",
        result:
          "The SVD approach achieved 0.89 RMSE, and the hybrid model improved diversity while maintaining accuracy. The API serves recommendations in under 50ms.",
      },
      keyPoints: [
        "Multiple algorithm approaches",
        "Proper evaluation metrics",
        "Hybrid thinking",
        "Production considerations",
      ],
    },
    {
      id: "rec-q2-cold-start",
      question: "How do you handle the cold start problem?",
      starAnswer: {
        situation:
          "New users and new items don't have interaction history, making collaborative filtering ineffective.",
        task: "I needed strategies to provide reasonable recommendations for cold start cases.",
        action:
          "For new users, I use popularity-based recommendations initially and demographic similarity. For new items, I use content-based features (genres, actors) to find similar items. I also implemented an onboarding flow asking users to rate a few movies.",
        result:
          "These strategies reduced cold start bounce rate by 40% and helped new users discover relevant content faster.",
      },
      keyPoints: [
        "Understanding cold start problem",
        "Multiple mitigation strategies",
        "Content-based fallback",
        "User onboarding importance",
      ],
    },
    {
      id: "rec-q3-scale",
      question: "How would you scale this for millions of users?",
      starAnswer: {
        situation:
          "The current implementation works for 100K users but wouldn't scale to millions.",
        task: "I needed to design for much larger scale with real-time requirements.",
        action:
          "I would use approximate nearest neighbors (ANN) like Faiss for similarity search, pre-compute recommendations in batch jobs, cache popular recommendations, and use feature stores for real-time features. I'd also consider deep learning models like two-tower architecture.",
        result:
          "This architecture could scale to millions of users while maintaining sub-100ms latency for recommendations.",
      },
      keyPoints: [
        "ANN for scalability",
        "Batch vs real-time trade-offs",
        "Caching strategies",
        "Modern ML architectures",
      ],
    },
  ],
};

// Add new projects to the main object
PROJECT_TEMPLATES["image-classifier"] = IMAGE_CLASSIFIER;
PROJECT_TEMPLATES["recommendation-system"] = RECOMMENDATION_SYSTEM;

export function getProjectTemplate(id: string): ProjectTemplate | undefined {
  return PROJECT_TEMPLATES[id];
}

export function getAllProjectTemplates(): ProjectTemplate[] {
  return Object.values(PROJECT_TEMPLATES);
}

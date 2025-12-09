// src/data/resume-ready/behavioral-questions.ts

export type QuestionPriority = "critical" | "high" | "medium";
export type QuestionCategory =
  | "general"
  | "technical"
  | "learning"
  | "failure"
  | "communication"
  | "initiative"
  | "motivation";

export interface BehavioralQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  priority: QuestionPriority;
  estimatedPrepTime: string; // e.g., "15-20 minutes"

  whatTheyreLookingFor: string[];

  starFramework: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };

  exampleAnswer: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };

  pitfalls: string[];
  tips: string[];
  followUpQuestions?: string[];
  tags: string[];
}

export const BEHAVIORAL_QUESTIONS: BehavioralQuestion[] = [
  // ============================================================================
  // QUESTION 1: Tell Me About Yourself
  // ============================================================================

  {
    id: "general-01",
    category: "general",
    question: "Tell me about yourself. Walk me through your resume.",
    difficulty: "medium",
    priority: "critical",
    estimatedPrepTime: "20-30 minutes",

    whatTheyreLookingFor: [
      "Clear, concise narrative connecting your background to this role",
      "Genuine enthusiasm for ML/AI engineering",
      "Relevant technical skills and project experience",
      "Understanding of what the role requires",
    ],

    starFramework: {
      situation:
        "Your professional background, education, and current situation (30 seconds)",
      task: "Your career goals and why you're pursuing ML/AI engineering (20 seconds)",
      action:
        "Key experiences and projects demonstrating relevant skills (60 seconds)",
      result:
        "Why you're excited about this specific role/company (20 seconds)",
    },

    exampleAnswer: {
      situation:
        "I'm a software engineer with over 10 years of experience across companies like Google, USAA, and FedEx, currently running Polaris AI Studio, an AI automation consultancy in the Dallas-Fort Worth area. My background spans mobile development, enterprise systems, and cloud computing, with recent focus on machine learning and AI applications.",

      task: "Over the past year, I've been intentionally transitioning from traditional software engineering into ML/AI engineering because I'm fascinated by how AI can solve real-world problems at scale. I want to build production ML systems that people actually use, not just research projects.",

      action:
        "To build practical ML skills, I've been completing hands-on projects like a sentiment analysis API using BERT, where I focused on the full lifecycle—not just model accuracy, but deployment, optimization (reducing latency from 800ms to under 200ms), handling concurrent users, and monitoring. I've also been helping local businesses implement AI solutions, which taught me how to bridge the gap between technical capabilities and business needs. My technical toolkit now includes Python, PyTorch, transformers, Flask/FastAPI, Docker, and cloud deployment platforms.",

      result:
        'I\'m specifically excited about this role because it combines production ML engineering with [specific aspect from job description—e.g., "building scalable NLP systems" or "working on recommendation algorithms"]. My experience shipping production systems, optimizing for performance, and working with real users gives me a strong foundation, and I\'m eager to deepen my ML expertise on a dedicated ML team.',
    },

    pitfalls: [
      "Going through your entire career chronologically (boring and too long)",
      "Being too technical or listing every skill you have",
      "Not connecting your background to the specific role",
      "Speaking for more than 2 minutes (aim for 90-120 seconds)",
      "Sounding rehearsed instead of conversational",
    ],

    tips: [
      "Practice out loud and time yourself—aim for under 2 minutes",
      "Structure: Past (30s) → Transition (20s) → Recent (60s) → Future (20s)",
      'Tailor the "why this role" part to each company',
      "End with enthusiasm and a natural transition to questions",
      "Have 2 versions ready: 90-second and 30-second elevator pitch",
    ],

    followUpQuestions: [
      "Why are you leaving your current role?",
      "What specifically interests you about machine learning?",
      "What type of ML problems excite you most?",
    ],

    tags: ["opening", "introduction", "career-story", "must-prepare"],
  },

  // ============================================================================
  // QUESTION 2: Tell Me About This Project
  // ============================================================================

  {
    id: "technical-01",
    category: "technical",
    question: "Tell me about this sentiment analysis project on your resume.",
    difficulty: "medium",
    priority: "critical",
    estimatedPrepTime: "20-30 minutes",

    whatTheyreLookingFor: [
      "Clear explanation of the project's purpose and value",
      "Technical depth without unnecessary jargon",
      "Focus on impact and results, not just implementation",
      "Evidence of production-ready thinking",
    ],

    starFramework: {
      situation: "What problem were you solving? Why this project?",
      task: "What were you trying to build? What were the constraints/challenges?",
      action:
        "How did you build it? What technical decisions did you make and why?",
      result: "What was the outcome? Metrics, learning, impact.",
    },

    exampleAnswer: {
      situation:
        "I wanted to build a project that demonstrated end-to-end ML engineering skills—not just using a model, but deploying it properly for production use. Sentiment analysis is a real business need (customer feedback analysis, social media monitoring), so I chose to build a production-ready API that could actually be used, not just a Jupyter notebook.",

      task: "The goal was to create a REST API that could analyze customer feedback sentiment in real-time with three key requirements: (1) High accuracy (target 85%+), (2) Fast response time (under 200ms for good UX), and (3) Handle concurrent requests (50+ users). These constraints mirror real production requirements.",

      action:
        "I built this systematically: First, I selected DistilBERT as the model—it's 60% faster than BERT while maintaining 97% of the accuracy, which aligned with my latency requirements. Second, I implemented the Flask API with proper error handling, request validation, and comprehensive testing. Third, I optimized performance through three strategies: an LRU caching layer for repeated queries (95%+ cache hit rate), batch processing for multiple texts, and switching to Gunicorn for production serving. I also built a clean web interface and deployed the complete system to Railway with Docker. Throughout, I focused on metrics: measuring response times, tracking cache efficiency, and load testing with concurrent users.",

      result:
        "The final system achieved 89% accuracy on sentiment classification, response times under 200ms (down from initial 800-1200ms—a 75% improvement), and successfully handled 50+ concurrent users in testing. The deployed system is live at [URL] and includes monitoring and logging. Most importantly, this project taught me that production ML is about the complete system—accuracy, latency, reliability, and user experience—not just model performance. I documented everything in a detailed README and created tutorial content to help others learn.",
    },

    pitfalls: [
      "Getting too deep into technical details without explaining why",
      'Not quantifying your results (say "89% accuracy" not "good accuracy")',
      "Focusing only on what you built, not the problem you solved",
      "Forgetting to mention challenges or trade-offs you faced",
    ],

    tips: [
      "Lead with the problem and impact, then explain the technical solution",
      'Use the phrase "systematically" or "strategic approach" to show thoughtfulness',
      "Always quantify: response times, accuracy, cache hit rates, user load",
      "Mention at least one challenge and how you overcame it",
      "Be ready to go deeper on any technical detail you mention",
    ],

    followUpQuestions: [
      "Why did you choose Flask over FastAPI or Django?",
      "How did you evaluate model performance?",
      "What would you do differently if you rebuilt this?",
      "How would you scale this to 10,000 users?",
    ],

    tags: [
      "project-deep-dive",
      "technical-depth",
      "must-prepare",
      "sentiment-analysis",
    ],
  },

  // ============================================================================
  // QUESTION 3: Biggest Technical Challenge
  // ============================================================================

  {
    id: "technical-02",
    category: "technical",
    question:
      "What was the biggest technical challenge you faced in a recent project, and how did you overcome it?",
    difficulty: "medium",
    priority: "critical",
    estimatedPrepTime: "15-20 minutes",

    whatTheyreLookingFor: [
      "Systematic problem-solving approach",
      "Technical depth and learning agility",
      "Resilience when facing obstacles",
      "Ability to break down complex problems",
    ],

    starFramework: {
      situation: "What was the project and what challenge did you encounter?",
      task: "Why was this challenging? What made it hard? What were the constraints?",
      action: "Walk through your problem-solving process step-by-step",
      result: "What was the outcome? What did you learn?",
    },

    exampleAnswer: {
      situation:
        "In my sentiment analysis project, the biggest challenge was performance optimization. My initial BERT-based implementation had response times of 800-1200ms per request, which was far too slow for a real-time API. For context, users expect web responses under 200ms for a good experience.",

      task: "I needed to reduce latency to under 200ms while maintaining high accuracy (can't sacrifice quality for speed) and handling concurrent requests. This was critical because slow APIs lead to poor user experience and wouldn't be viable in production. The constraint was that I couldn't just throw more compute at it—I needed smart optimizations.",

      action:
        "I took a systematic approach: First, I profiled the application to identify bottlenecks. Model inference was taking ~700ms per request—the clear culprit. Second, I researched optimization techniques and prioritized three strategies: (1) Model selection: I switched from bert-base to distilbert-base, which is 60% faster while maintaining 97% accuracy. This immediately got me to ~400ms. (2) Caching: I implemented an LRU cache with MD5 hashing for text inputs. Since customer feedback often contains repeated phrases, this gave me 50-100x speedup for cached requests. (3) Batch processing: I modified the API to accept batch requests, processing multiple texts together to leverage parallelism. I benchmarked each optimization individually to measure its impact before combining them.",

      result:
        "The combined optimizations reduced response time from 800ms to under 200ms for uncached requests, and 5-15ms for cached requests. The cache achieved a 95%+ hit rate in realistic usage patterns. The system successfully handled 50+ concurrent users in load testing. More importantly, this taught me that optimization isn't one big fix—it's systematic profiling, targeted improvements, and understanding your usage patterns. I now always profile before optimizing and measure everything.",
    },

    pitfalls: [
      "Choosing a challenge that's too simple or too vague",
      "Not explaining why it was challenging",
      "Jumping to the solution without showing your process",
      "Not mentioning what you learned or would do differently",
    ],

    tips: [
      "Show your systematic approach: profile → research → test → measure",
      "Mention specific numbers (800ms → 200ms shows real improvement)",
      "Explain trade-offs you considered (speed vs accuracy)",
      "End with what you learned that applies beyond this project",
    ],

    followUpQuestions: [
      "What other approaches did you consider?",
      "How did you decide which optimization to try first?",
      "What would you do if you needed even better performance?",
    ],

    tags: [
      "problem-solving",
      "optimization",
      "technical-depth",
      "sentiment-analysis",
    ],
  },

  // ============================================================================
  // QUESTION 4: Learning New Technology
  // ============================================================================

  {
    id: "learning-01",
    category: "learning",
    question:
      "Tell me about a time when you had to learn a new technology or skill quickly. How did you approach it?",
    difficulty: "easy",
    priority: "high",
    estimatedPrepTime: "10-15 minutes",

    whatTheyreLookingFor: [
      "Learning agility and self-directed learning",
      "Effective learning strategies",
      "Ability to apply knowledge practically",
      "Growth mindset",
    ],

    starFramework: {
      situation:
        "What technology did you need to learn? Why was speed important?",
      task: "What goal did you need to achieve with this new technology?",
      action:
        "Describe your learning process: resources, practice, validation",
      result: "How quickly did you learn it? How well could you apply it?",
    },

    exampleAnswer: {
      situation:
        "When I started my sentiment analysis project, I had Python experience but had never deployed a production ML model or built a REST API. I needed to learn Flask, transformer models, and ML deployment practices within about a week to complete the project while it was fresh in my mind.",

      task: 'My goal wasn\'t just to make something "work"—I wanted to build a production-quality API with proper error handling, optimization, and deployment that would be impressive in interviews. This meant understanding not just the syntax, but best practices.',

      action:
        'I took a structured learning approach: First, I spent 2 hours reading Flask documentation to identify key concepts—routes, request handling, JSON responses, error handling. I didn\'t try to learn everything, just what I needed. Second, I built a simple "Hello World" API to understand the basics through practice. Third, I found 3 high-quality blog posts specifically on ML model deployment and extracted common patterns—things like using production WSGI servers, implementing health checks, and proper logging. Fourth, I studied example GitHub repos to see how experienced engineers structure production ML APIs. Finally, I implemented features incrementally: basic endpoint first, then error handling, then validation, then optimization. I tested each piece before moving forward. The key was learning by doing, with good examples to follow.',

      result:
        'Within 5 days, I had a working production-quality API with proper error handling, caching, and deployment. More importantly, I developed a learning strategy I now use for any new technology: (1) Learn just-in-time, not everything upfront. (2) Start with official docs for concepts. (3) Find high-quality examples from experienced developers. (4) Build incrementally and test constantly. This "learn-by-doing with good examples" approach is now my default, and it\'s much faster than reading entire books or courses before starting.',
    },

    pitfalls: [
      'Claiming you learned something "overnight" (unrealistic)',
      "Not explaining your actual learning process",
      "Making it sound like you knew everything already",
      "Not showing how you validated your understanding",
    ],

    tips: [
      "Be honest about what you didn't know initially",
      "Show you can identify good learning resources",
      "Emphasize learning by doing, not just reading",
      "Mention a learning strategy you can reuse",
    ],

    followUpQuestions: [
      "What learning resources do you prefer (docs, courses, books, blogs)?",
      "How do you balance learning depth vs getting things done?",
      "Give another example of learning something quickly",
    ],

    tags: ["learning-agility", "self-directed", "practical", "growth"],
  },

  // ============================================================================
  // QUESTION 5: Failure or Mistake
  // ============================================================================

  {
    id: "failure-01",
    category: "failure",
    question:
      "Tell me about a time when you failed or made a significant mistake. How did you handle it?",
    difficulty: "hard",
    priority: "critical",
    estimatedPrepTime: "20-25 minutes",

    whatTheyreLookingFor: [
      "Self-awareness and honesty",
      "Accountability (not blaming others)",
      "Learning from mistakes",
      "Resilience and growth mindset",
    ],

    starFramework: {
      situation:
        "What happened? What was the mistake? Be honest and specific.",
      task: "Why did this failure matter? What needed to be fixed?",
      action:
        "How did you respond? Fix it? Communicate it? Prevent recurrence?",
      result: "What was the outcome? What did you learn? How have you changed?",
    },

    exampleAnswer: {
      situation:
        "In an early version of my sentiment analysis API, I was eager to share it publicly, so I deployed to Railway and posted the URL on social media. Within a few hours, the server crashed. I hadn't done any load testing and was using Flask's development server, which isn't designed for concurrent requests. Under even moderate traffic, it completely failed.",

      task: 'I needed to fix the immediate problem (get the service back up), communicate honestly about what happened, and ensure it wouldn\'t happen again. This was embarrassing because I had promoted it as "production-ready" when it clearly wasn\'t.',

      action:
        "I took immediate action: First, I took the server offline completely to prevent further issues and user frustration. Second, I sent a message to everyone who had the URL: \"I deployed prematurely without proper load testing. The service is down while I fix production readiness issues. I'll have it back up within 24 hours.\" No excuses, just facts. Third, I did proper research on production deployment—this is when I learned about Gunicorn, worker processes, and production WSGI servers. Fourth, I set up a comprehensive test suite including load testing with 50+ concurrent requests using Python's requests library. Fifth, I implemented proper monitoring, health checks, and logging. Finally, I created a deployment checklist: load testing ✓, production server ✓, monitoring ✓, rate limiting ✓, proper error handling ✓. I wouldn't deploy without checking every item.",

      result:
        'The redeployment handled traffic without issues. More importantly, I learned that "works on my laptop" is completely different from "works in production." This mistake fundamentally changed how I think about deployment—I\'m now almost paranoid about production readiness, which is a good thing. The embarrassment of that crash made me a better engineer. I now always test under realistic conditions before calling something "production-ready," and I have rollback plans. This experience also taught me the value of honest communication—people respect owning mistakes more than making excuses.',
    },

    pitfalls: [
      'Choosing a trivial "failure" that isn\'t really a failure',
      "Blaming others, the tools, or external circumstances",
      "Being defensive or making excuses",
      "Not showing specific learning or behavior change",
      "Telling a story that makes you look reckless",
    ],

    tips: [
      "Choose a real failure that taught you something important",
      'Own it completely—no "but" or "however" or blame',
      "Show immediate corrective action and long-term prevention",
      "Emphasize what changed in your approach permanently",
      "Frame it as a growth experience that made you better",
    ],

    followUpQuestions: [
      "What would you do differently if you could redo it?",
      "How did this change your approach to future projects?",
      "Tell me about another time you failed",
    ],

    tags: ["failure", "accountability", "learning", "must-prepare", "production"],
  },

  // ============================================================================
  // QUESTION 6: Explaining Technical Concepts
  // ============================================================================

  {
    id: "communication-01",
    category: "communication",
    question:
      "Describe a time when you had to explain a complex technical concept to a non-technical person. How did you approach it?",
    difficulty: "medium",
    priority: "high",
    estimatedPrepTime: "15-20 minutes",

    whatTheyreLookingFor: [
      "Communication skills with non-technical audiences",
      "Ability to simplify without oversimplifying",
      "Use of analogies and relatable examples",
      "Focus on value and impact, not just technology",
    ],

    starFramework: {
      situation:
        "Who was the person? What concept needed explanation? Why was it important?",
      task: "What did they need to understand? What decisions depended on this?",
      action:
        "How did you explain it? What analogies did you use? How did you check understanding?",
      result: "Did they understand? What was the outcome?",
    },

    exampleAnswer: {
      situation:
        "While demonstrating my sentiment analysis project to a friend who works in customer service (non-technical), she asked why the system sometimes shows different confidence scores for similar-sounding feedback, and why we can't just say \"positive\" or \"negative\" without the percentage.",

      task: "I needed to explain that ML models work with probability, not certainty, and that confidence scores are actually crucial for making good business decisions—especially when handling customer feedback. She needed to understand this wasn't a bug, but a feature that makes the system more useful.",

      action:
        "I used an analogy from her domain: \"Think about reading customer emails. When someone writes 'Thanks', you're not 100% certain if they're being sarcastic or genuine, right? You might be 60% confident it's positive based on context. But when they write 'Thank you so much, this solved my problem!', you're 95% confident it's genuine appreciation. The AI works exactly the same way—it gives you its confidence level.\" Then I showed concrete examples from the interface: high-confidence predictions we can trust immediately, and low-confidence ones where a human should review. I connected it directly to her work: \"In customer service, you'd want to prioritize the clearly angry customers—high-confidence negative feedback—and route them to senior support immediately. The uncertain ones could be flagged for manager review. This confidence score helps you triage effectively.\" I asked her to explain it back to make sure she got it.",

      result:
        "She immediately understood and even suggested a great use case: \"So we could auto-route very angry customers—high confidence negative—to senior agents, and flag low-confidence feedback for quality review?\" Exactly. This conversation taught me that non-technical people aren't \"non-technical\" in their domain—they just need the right framing. She understood probability and confidence intuitively from her work; I just needed to connect my technical concept to her existing mental models. Now I always start with \"what does this enable you to do?\" rather than \"how does this work?\" When explaining to business stakeholders, I lead with value and use domain-specific analogies.",
    },

    pitfalls: [
      "Using technical jargon without explaining it",
      "Oversimplifying to the point of being wrong",
      "Not checking if they actually understood",
      "Talking down to them or being condescending",
      "Not connecting to business value or their context",
    ],

    tips: [
      "Use analogies from their domain or everyday life",
      'Start with "why it matters" before "how it works"',
      "Show concrete examples, not just abstract concepts",
      "Ask them to explain it back to verify understanding",
      "Focus on what they can do with it, not how it's built internally",
    ],

    followUpQuestions: [
      "How do you adjust your explanation for different audiences?",
      "What if someone still doesn't understand after your explanation?",
      "How technical do you go with product managers vs engineers?",
    ],

    tags: ["communication", "non-technical", "teaching", "business-value"],
  },

  // ============================================================================
  // QUESTION 7: Taking Initiative
  // ============================================================================

  {
    id: "initiative-01",
    category: "initiative",
    question:
      "Tell me about a time when you took initiative on something without being asked. What motivated you?",
    difficulty: "medium",
    priority: "high",
    estimatedPrepTime: "10-15 minutes",

    whatTheyreLookingFor: [
      "Proactive mindset and ownership",
      "Ability to identify opportunities",
      "Self-motivation and drive",
      "Impact orientation",
    ],

    starFramework: {
      situation: "What situation or gap did you observe?",
      task: "What did you decide to do? Why did it matter even though no one asked?",
      action: "How did you take initiative? What did you build/do?",
      result: "What was the impact? How did others react?",
    },

    exampleAnswer: {
      situation:
        "After completing my sentiment analysis API, I had a working backend that could classify text sentiment accurately and quickly. However, the only way to interact with it was through curl commands or Postman—not user-friendly for demos or for non-technical people to try it.",

      task: 'I realized that to make this project truly impressive for my portfolio and useful for demonstrations, I needed a web interface. This wasn\'t part of my original plan—the API was "done"—but I saw an opportunity to add significant value with just a few hours of work.',

      action:
        "Without being asked or required, I designed and built a clean, modern web interface. I focused on user experience: (1) Created a gradient purple/blue design that feels professional and modern. (2) Added example text chips so users could try it immediately without thinking of inputs. (3) Included visual feedback—emoji indicators, color-coded results (green for positive, red for negative), confidence percentages. (4) Added loading animations so users know the system is working. (5) Made it fully responsive so it works on mobile devices. (6) Deployed everything together so anyone could access it via a public URL. The entire addition took about 4-5 hours over one evening.",

      result:
        'The web interface transformed the project from a "backend API" to a "complete product." When I showed it to mentors and potential employers, they were significantly more impressed because they could interact with it immediately—no technical setup required. It led directly to two additional interview opportunities where I demonstrated it live. One interviewer said, "This shows product thinking, not just coding ability." I learned that going "10% beyond" the basic requirements—whether it\'s adding a UI, writing documentation, or deploying publicly—is what separates good projects from great ones. It signals ownership and product sense, qualities that hiring managers value highly.',
    },

    pitfalls: [
      "Making it sound like you were a hero while others did nothing",
      "Taking initiative that caused problems or wasn't appropriate",
      'Not explaining why you took initiative (just "I felt like it")',
      "Claiming credit for something that was actually assigned",
    ],

    tips: [
      "Explain the gap or opportunity you identified",
      "Show you considered the value and impact",
      "Demonstrate good judgment about when to ask vs when to just do",
      "Quantify the outcome where possible (led to 2 interviews)",
      "Show it became a repeatable habit, not a one-time thing",
    ],

    followUpQuestions: [
      "Did you get permission before adding the UI, or just build it?",
      "What if your manager disagreed with your initiative?",
      "How do you decide when to take initiative vs when to ask first?",
    ],

    tags: ["initiative", "ownership", "product-thinking", "proactive"],
  },

  // ============================================================================
  // QUESTION 8: System Improvement
  // ============================================================================

  {
    id: "technical-03",
    category: "technical",
    question:
      "How would you improve or scale this system if you had more time and resources?",
    difficulty: "medium",
    priority: "high",
    estimatedPrepTime: "15-20 minutes",

    whatTheyreLookingFor: [
      "Systems thinking and architecture awareness",
      "Understanding of trade-offs and priorities",
      "Knowledge of production best practices",
      "Ability to think beyond the current implementation",
    ],

    starFramework: {
      situation: "What is the current system and its limitations?",
      task: "What improvements would you prioritize and why?",
      action: "Describe specific improvements across different dimensions",
      result: "What would be the impact of these improvements?",
    },

    exampleAnswer: {
      situation:
        "My current sentiment analysis system works well for a demo project—it's accurate, fast, and handles moderate traffic. However, if this were a real production system at a company, there are several dimensions where it would need significant improvement.",

      task: "If I had more time and resources, I'd prioritize improvements in three categories: model capabilities, system architecture, and production operations. The prioritization would depend on the business context—a startup would focus differently than an enterprise.",

      action:
        "For model improvements: First, I'd add multi-class sentiment beyond just positive/negative—include neutral, and potentially emotions like joy, anger, sadness. This provides much richer insights. Second, I'd implement domain-specific fine-tuning. The current model works on general text, but if this were for a specific industry (e.g., healthcare, finance), I'd fine-tune on domain data for better accuracy. Third, I'd add model confidence calibration to ensure the confidence scores are reliable for decision-making.\n\nFor system architecture: First, I'd move from in-memory caching to Redis for distributed caching across multiple API instances, enabling horizontal scaling. Second, I'd implement asynchronous processing with a message queue like RabbitMQ for non-real-time requests—batch analysis of thousands of reviews doesn't need instant responses. Third, I'd add proper load balancing with Nginx and database persistence for historical analysis. Fourth, I'd implement A/B testing infrastructure to safely deploy new model versions.\n\nFor production operations: First, I'd add comprehensive monitoring with Prometheus and Grafana—track latency, error rates, model drift. Second, implement proper logging with structured logging and error tracking through Sentry. Third, set up CI/CD pipelines for automated testing and deployment. Fourth, add API authentication and rate limiting to prevent abuse. Fifth, create runbooks for common operational issues.",

      result:
        "These improvements would transform a demo project into an enterprise-ready system capable of handling millions of requests daily with high reliability. The key insight is that different improvements matter at different stages: for an MVP, focus on features that provide immediate value (multi-class sentiment, batch upload). For scale, focus on infrastructure (distributed caching, load balancing). For enterprise, focus on operations (monitoring, security, compliance). The prioritization depends on your users, scale, and constraints. This systems thinking—understanding the full lifecycle from development to operations—is what separates junior engineers from senior ones.",
    },

    pitfalls: [
      "Just listing random improvements without prioritization",
      "Not explaining trade-offs or why something matters",
      "Only focusing on technical improvements, ignoring business value",
      "Suggesting improvements that are too complex for the use case",
    ],

    tips: [
      "Group improvements into categories (model, system, operations)",
      "Explain trade-offs and when each improvement matters",
      "Show you understand different priorities at different scales",
      "Connect improvements to specific business outcomes",
      "Demonstrate knowledge of production best practices",
    ],

    followUpQuestions: [
      "Which improvement would you prioritize first and why?",
      "How would you handle model drift in production?",
      "What monitoring metrics would you track?",
    ],

    tags: ["system-design", "scalability", "production", "architecture"],
  },

  // ============================================================================
  // QUESTION 9: Why ML/AI Engineering
  // ============================================================================

  {
    id: "motivation-01",
    category: "motivation",
    question:
      "Why are you interested in machine learning and AI engineering specifically?",
    difficulty: "easy",
    priority: "high",
    estimatedPrepTime: "10-15 minutes",

    whatTheyreLookingFor: [
      "Genuine passion and curiosity for ML/AI",
      "Understanding of what ML engineers actually do",
      "Clear articulation of your motivation",
      "Realistic expectations about the field",
    ],

    starFramework: {
      situation: "Your background and what sparked your interest",
      task: "What specifically draws you to ML/AI vs other fields",
      action: "How you've pursued this interest (projects, learning)",
      result: "What you hope to achieve in an ML engineering career",
    },

    exampleAnswer: {
      situation:
        "Coming from traditional software engineering, I've always been interested in building systems that solve real problems. But about a year ago, I started noticing how AI was transforming everyday products I used—better search results, smart recommendations, automated workflows—and I realized ML was moving from research labs into production systems.",

      task: "What specifically excites me about ML engineering is the unique intersection of three things: (1) Technical challenge—ML systems require thinking about data, algorithms, and infrastructure simultaneously. (2) Real-world impact—the difference between a 90% accurate model and a 95% accurate model could mean millions in business value or significantly better user experiences. (3) Continuous learning—the field evolves rapidly, so there's always something new to learn and apply.",

      action:
        "To validate this interest wasn't just theoretical, I started building practical ML projects like my sentiment analysis API. This experience confirmed what I love about the field: I enjoyed the entire lifecycle—from choosing the right model, to optimizing performance, to deploying it properly. I particularly enjoyed the optimization challenge of getting response times from 800ms to under 200ms—that combination of ML knowledge and systems engineering. I also started Polaris AI Studio to help local businesses implement AI solutions, which taught me how to bridge technical capabilities with business needs. The more I work in this space, the more certain I am this is where I want to focus my career.",

      result:
        "Long-term, I want to be someone who can take an ML idea from concept to production deployment—not just train models, but build complete systems that millions of people use. I'm particularly interested in [tailor this to the company: NLP applications, recommendation systems, computer vision, etc.] because [specific reason related to the company]. What excites me about this role specifically is the opportunity to work on production ML systems at scale, learning from experienced ML engineers while contributing to real products.",
    },

    pitfalls: [
      'Being vague: "AI is cool" or "ML is the future" without substance',
      "Not showing you understand what ML engineers actually do daily",
      "Making it all about the money or job market",
      "Not having concrete examples of pursuing this interest",
    ],

    tips: [
      "Be specific about what excites you (the intersection of X and Y)",
      "Show you've done projects to validate your interest",
      "Connect your past experience to why ML makes sense for you",
      "Tailor the \"long-term goals\" part to the company's domain",
      "Be genuine—passion comes through in how you talk about it",
    ],

    followUpQuestions: [
      "What area of ML interests you most (NLP, CV, recommender systems)?",
      "Where do you see ML going in the next 5 years?",
      "What's the most exciting ML paper or project you've seen recently?",
    ],

    tags: ["motivation", "career-goals", "passion", "why-ml"],
  },

  // ============================================================================
  // QUESTION 10: Why This Company
  // ============================================================================

  {
    id: "motivation-02",
    category: "motivation",
    question:
      "Why are you interested in our company? Why this role specifically?",
    difficulty: "medium",
    priority: "critical",
    estimatedPrepTime: "20-30 minutes (requires company research)",

    whatTheyreLookingFor: [
      "You've done your research on the company",
      "Genuine interest in their specific mission/products",
      "Understanding of how you'd fit and contribute",
      "Thoughtful questions about the role/team",
    ],

    starFramework: {
      situation:
        "What you know about the company and why it stands out to you",
      task: "What specifically attracts you to this role and team",
      action: "How your background and skills align with their needs",
      result: "What you hope to contribute and learn",
    },

    exampleAnswer: {
      situation:
        "[Research the company thoroughly and fill this in specifically. Example framework:] I've been following [Company] for [time period] and I'm impressed by [specific product/achievement/mission]. What particularly stands out is [specific technical challenge they're solving or impact they're having]. For example, [mention a recent product launch, blog post, or news about them].",

      task: 'What excites me about this ML Engineer role specifically is [mention 2-3 specific things from the job description]. First, [specific aspect like "building scalable NLP systems" or "working on recommendation algorithms"]. Second, [team/culture aspect like "the emphasis on production ML" or "the collaborative team structure"]. Third, [growth aspect like "the opportunity to learn from experienced ML engineers" or "working on problems at this scale"].',

      action:
        "My background aligns well with what you're looking for: [connect 2-3 of your strengths to their needs]. For example, my experience optimizing the sentiment analysis API from 800ms to under 200ms demonstrates the performance optimization mindset your team values. My work helping businesses implement AI solutions shows I can think about ML from a product perspective, not just technically. And my 10+ years in software engineering gives me a strong foundation in building production systems. I'm particularly excited to bring [specific skill] while learning [specific area you want to grow in].",

      result:
        "I see this as a mutual growth opportunity: I can contribute immediately with [specific skills/experience], while growing my expertise in [what you want to learn]. I'm especially eager to work on [specific project/challenge you know they're working on], and learn from a team that [something specific about their team/culture]. I have a few questions: [prepare 2-3 thoughtful questions about the role, team, or technical challenges].",
    },

    pitfalls: [
      'Generic answers that could apply to any company ("You\'re a great company")',
      "Only talking about what you want, not what you'll contribute",
      "Not demonstrating any research about the company",
      "Focusing only on perks/compensation",
      "Bad-mouthing your current/previous employer",
    ],

    tips: [
      "Research: Read their blog, recent news, product pages, engineering blog",
      "Find 2-3 specific things that genuinely interest you",
      "Connect your skills/experience to their specific needs",
      "Prepare 2-3 thoughtful questions that show you've done research",
      "Be genuine—they can tell if you're just saying what they want to hear",
      "Rewrite this answer specifically for each company you interview with",
    ],

    followUpQuestions: [
      "What do you know about our products?",
      "What do you think our biggest technical challenges are?",
      "Do you have any questions for us?",
    ],

    tags: ["motivation", "company-fit", "must-prepare", "customize-per-company"],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getQuestionsByPriority = (
  priority: QuestionPriority
): BehavioralQuestion[] => {
  return BEHAVIORAL_QUESTIONS.filter((q) => q.priority === priority);
};

export const getQuestionsByCategory = (
  category: QuestionCategory
): BehavioralQuestion[] => {
  return BEHAVIORAL_QUESTIONS.filter((q) => q.category === category);
};

export const getQuestionById = (id: string): BehavioralQuestion | undefined => {
  return BEHAVIORAL_QUESTIONS.find((q) => q.id === id);
};

export const getCriticalQuestions = (): BehavioralQuestion[] => {
  return getQuestionsByPriority("critical");
};

export const getHighPriorityQuestions = (): BehavioralQuestion[] => {
  return getQuestionsByPriority("high");
};

// ============================================================================
// METADATA FOR UI
// ============================================================================

export const QUESTION_CATEGORIES_META = [
  {
    id: "general" as const,
    name: "General & Introduction",
    icon: "👋",
    description: "Opening questions and self-introduction",
  },
  {
    id: "technical" as const,
    name: "Technical Deep Dive",
    icon: "💻",
    description: "Questions about your projects and technical decisions",
  },
  {
    id: "learning" as const,
    name: "Learning & Growth",
    icon: "📚",
    description: "Questions about learning agility and skill development",
  },
  {
    id: "failure" as const,
    name: "Failure & Resilience",
    icon: "📈",
    description: "Questions about mistakes, setbacks, and growth",
  },
  {
    id: "communication" as const,
    name: "Communication",
    icon: "💬",
    description: "Questions about explaining concepts and collaboration",
  },
  {
    id: "initiative" as const,
    name: "Initiative & Ownership",
    icon: "🚀",
    description: "Questions about proactive behavior and taking ownership",
  },
  {
    id: "motivation" as const,
    name: "Motivation & Fit",
    icon: "🎯",
    description: "Questions about why ML/AI and why this company",
  },
];

export const PRIORITY_LABELS = {
  critical: {
    label: "Critical",
    color: "red",
    description: "Asked in 80%+ of interviews - must prepare",
  },
  high: {
    label: "High Priority",
    color: "orange",
    description: "Common questions that demonstrate key skills",
  },
  medium: {
    label: "Good to Know",
    color: "blue",
    description: "Helpful to prepare but less frequently asked",
  },
} as const;

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import { stages, contentTypes } from "./schema";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  console.log("Seeding database...");

  // Seed stages
  const stagesData = [
    {
      slug: "resume-ready",
      name: "Resume Ready",
      description:
        "Build your portfolio and craft compelling resume bullet points. Complete guided projects that demonstrate real ML/AI skills.",
      weekRange: "Week 1-2",
      goal: "Have a resume worth submitting",
      order: 1,
    },
    {
      slug: "coding-ready",
      name: "Coding Ready",
      description:
        "Master algorithm problems and data structures. Practice LeetCode-style problems commonly asked in ML/AI interviews.",
      weekRange: "Week 3-6",
      goal: "Pass coding rounds",
      order: 2,
    },
    {
      slug: "ml-ready",
      name: "ML Ready",
      description:
        "Deep dive into ML concepts and ML coding problems. Understand the theory and implementation details.",
      weekRange: "Week 7-10",
      goal: "Pass ML technical rounds",
      order: 3,
    },
    {
      slug: "system-design-ready",
      name: "System Design Ready",
      description:
        "Learn to design ML systems at scale. Practice common ML system design interview questions.",
      weekRange: "Week 11-13",
      goal: "Pass system design rounds",
      order: 4,
    },
    {
      slug: "mock-interview",
      name: "Mock Interview Practice",
      description:
        "Put it all together with mock interview sets. Build interview stamina and refine your presentation.",
      weekRange: "Ongoing",
      goal: "Build interview stamina",
      order: 5,
    },
  ];

  console.log("Inserting stages...");
  for (const stage of stagesData) {
    await db.insert(stages).values(stage).onConflictDoNothing();
  }

  // Seed content types
  const contentTypesData = [
    {
      slug: "guided_project",
      name: "Guided Project",
      description: "Step-by-step project tutorials with resume bullet points",
    },
    {
      slug: "resume_bullet",
      name: "Resume Bullet",
      description: "Resume bullet point examples and templates",
    },
    {
      slug: "bq_question",
      name: "Behavioral Question",
      description: "Behavioral interview questions with sample answers",
    },
    {
      slug: "algorithm_problem",
      name: "Algorithm Problem",
      description: "LeetCode-style algorithm and data structure problems",
    },
    {
      slug: "ml_concept",
      name: "ML Concept",
      description: "ML concept questions - theory and fundamentals",
    },
    {
      slug: "ml_coding",
      name: "ML Coding",
      description: "ML coding problems - implement algorithms from scratch",
    },
    {
      slug: "system_design",
      name: "System Design",
      description: "ML system design problems",
    },
    {
      slug: "mock_interview",
      name: "Mock Interview Set",
      description: "Complete mock interview question sets",
    },
  ];

  console.log("Inserting content types...");
  for (const contentType of contentTypesData) {
    await db.insert(contentTypes).values(contentType).onConflictDoNothing();
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);

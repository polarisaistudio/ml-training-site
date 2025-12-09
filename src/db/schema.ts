import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  varchar,
  date,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Learning stages (the 5 main stages)
export const stages = pgTable("stages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  weekRange: varchar("week_range", { length: 50 }), // e.g., "Week 1-2"
  goal: text("goal"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Content types (project, question types, etc.)
export const contentTypes = pgTable("content_types", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
});

// Content items - base table for all content (polymorphic)
export const contentItems = pgTable("content_items", {
  id: serial("id").primaryKey(),
  stageId: integer("stage_id").references(() => stages.id),
  contentTypeId: integer("content_type_id").references(() => contentTypes.id),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  difficulty: varchar("difficulty", { length: 50 }), // easy, medium, hard
  isAvailable: boolean("is_available").default(false).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Real interview details type
export type RealInterviewDetails = {
  company?: string;
  position?: string;
  interviewDate?: string;
  result?: "passed" | "failed" | "pending";
  interviewerFocus?: string;
  hintsGiven?: string;
  followUpQuestions?: string[];
  myPerformance?: string;
  notes?: string;
};

// Questions - specific to question content
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  contentItemId: integer("content_item_id")
    .references(() => contentItems.id)
    .notNull(),
  content: text("content"), // Question content (markdown)
  answer: text("answer"), // Answer (markdown)
  sourceCompany: varchar("source_company", { length: 255 }),
  isVerified: boolean("is_verified").default(false).notNull(), // Verified from real interview
  tags: text("tags"), // JSON array of tags stored as text
  // New fields for real interview tracking
  sourceType: varchar("source_type", { length: 20 })
    .default("generated")
    .notNull(), // 'generated' or 'real-interview'
  interviewLogId: integer("interview_log_id").references(
    () => interviewLogs.id,
  ),
  realInterviewDetails: jsonb(
    "real_interview_details",
  ).$type<RealInterviewDetails>(),
});

// Projects - specific to project content
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  contentItemId: integer("content_item_id")
    .references(() => contentItems.id)
    .notNull(),
  content: text("content"), // Project tutorial content (markdown)
  resumeBullets: text("resume_bullets"), // JSON array of resume bullet points
  estimatedHours: integer("estimated_hours"),
});

// Interview logs - record of real interviews
export const interviewLogs = pgTable("interview_logs", {
  id: serial("id").primaryKey(),
  company: varchar("company", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }),
  interviewDate: date("interview_date"),
  roundType: varchar("round_type", { length: 100 }), // phone screen, onsite, etc.
  questionsAsked: text("questions_asked"), // Free text notes about questions
  difficulty: varchar("difficulty", { length: 50 }), // easy, medium, hard
  result: varchar("result", { length: 100 }), // passed, failed, pending, etc.
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Question sources - link questions to interview logs
export const questionSources = pgTable("question_sources", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id")
    .references(() => questions.id)
    .notNull(),
  interviewLogId: integer("interview_log_id")
    .references(() => interviewLogs.id)
    .notNull(),
  notes: text("notes"),
});

// Question progress - track user progress on questions
export const questionProgress = pgTable("question_progress", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id")
    .references(() => questions.id)
    .notNull(),
  sessionId: varchar("session_id", { length: 100 }).notNull(), // Anonymous session tracking
  completed: boolean("completed").default(false).notNull(),
  timeSpent: integer("time_spent").default(0).notNull(), // seconds
  notes: text("notes"),
  viewedAnswer: boolean("viewed_answer").default(false).notNull(),
  hintsRevealed: integer("hints_revealed").default(0).notNull(), // 0, 1, 2, or 3
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User solutions - store user's code solutions
export const userSolutions = pgTable("user_solutions", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id")
    .references(() => questions.id)
    .notNull(),
  sessionId: varchar("session_id", { length: 100 }).notNull(),
  code: text("code").notNull(),
  language: varchar("language", { length: 20 }).default("python").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const stagesRelations = relations(stages, ({ many }) => ({
  contentItems: many(contentItems),
}));

export const contentTypesRelations = relations(contentTypes, ({ many }) => ({
  contentItems: many(contentItems),
}));

export const contentItemsRelations = relations(contentItems, ({ one }) => ({
  stage: one(stages, {
    fields: [contentItems.stageId],
    references: [stages.id],
  }),
  contentType: one(contentTypes, {
    fields: [contentItems.contentTypeId],
    references: [contentTypes.id],
  }),
  question: one(questions),
  project: one(projects),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  contentItem: one(contentItems, {
    fields: [questions.contentItemId],
    references: [contentItems.id],
  }),
  sources: many(questionSources),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  contentItem: one(contentItems, {
    fields: [projects.contentItemId],
    references: [contentItems.id],
  }),
}));

export const interviewLogsRelations = relations(interviewLogs, ({ many }) => ({
  questionSources: many(questionSources),
}));

export const questionSourcesRelations = relations(
  questionSources,
  ({ one }) => ({
    question: one(questions, {
      fields: [questionSources.questionId],
      references: [questions.id],
    }),
    interviewLog: one(interviewLogs, {
      fields: [questionSources.interviewLogId],
      references: [interviewLogs.id],
    }),
  }),
);

export const questionProgressRelations = relations(
  questionProgress,
  ({ one }) => ({
    question: one(questions, {
      fields: [questionProgress.questionId],
      references: [questions.id],
    }),
  }),
);

export const userSolutionsRelations = relations(userSolutions, ({ one }) => ({
  question: one(questions, {
    fields: [userSolutions.questionId],
    references: [questions.id],
  }),
}));

// Resume Ready - Main progress tracking
export const resumeReadyProgress = pgTable("resume_ready_progress", {
  sessionId: varchar("session_id", { length: 100 }).primaryKey(),

  // Overall status
  readinessScore: integer("readiness_score").default(0).notNull(), // 0-100
  status: varchar("status", { length: 20 }).default("not-started").notNull(), // 'not-started' | 'in-progress' | 'ready'

  // Completed projects
  completedProjects: jsonb("completed_projects")
    .$type<
      {
        templateId: string;
        completedAt: string;
        selectedResumeStyle: "technical" | "impact" | "fullStack";
        questionsReviewed: string[];
      }[]
    >()
    .default([])
    .notNull(),

  // Resume tracking
  resumeBulletsCount: integer("resume_bullets_count").default(0).notNull(),
  resumeLastUpdated: timestamp("resume_last_updated"),

  // Interview prep tracking
  totalQuestionsReviewed: integer("total_questions_reviewed")
    .default(0)
    .notNull(),

  // Expert help
  expertCallBooked: boolean("expert_call_booked").default(false).notNull(),
  expertCallDate: timestamp("expert_call_date"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Resume Ready - Individual project completion tracking
export const projectCompletions = pgTable("project_completions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 100 }).notNull(),
  projectTemplateId: varchar("project_template_id", { length: 100 }).notNull(),

  status: varchar("status", { length: 20 }).default("not-started").notNull(), // 'not-started' | 'in-progress' | 'completed'
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),

  // Tutorial progress (array of step indices)
  completedSteps: jsonb("completed_steps")
    .$type<number[]>()
    .default([])
    .notNull(),

  // Resume selection
  selectedResumeStyle: varchar("selected_resume_style", { length: 20 }), // 'technical' | 'impact' | 'fullStack' | null
  bulletsCopied: boolean("bullets_copied").default(false).notNull(),

  // Interview prep
  reviewedQuestions: jsonb("reviewed_questions")
    .$type<string[]>()
    .default([])
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Resume Ready Relations
export const resumeReadyProgressRelations = relations(
  resumeReadyProgress,
  ({ many }) => ({
    projectCompletions: many(projectCompletions),
  }),
);

export const projectCompletionsRelations = relations(
  projectCompletions,
  ({ one }) => ({
    progress: one(resumeReadyProgress, {
      fields: [projectCompletions.sessionId],
      references: [resumeReadyProgress.sessionId],
    }),
  }),
);

// Type exports
export type Stage = typeof stages.$inferSelect;
export type NewStage = typeof stages.$inferInsert;
export type ContentType = typeof contentTypes.$inferSelect;
export type NewContentType = typeof contentTypes.$inferInsert;
export type ContentItem = typeof contentItems.$inferSelect;
export type NewContentItem = typeof contentItems.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type InterviewLog = typeof interviewLogs.$inferSelect;
export type NewInterviewLog = typeof interviewLogs.$inferInsert;
export type QuestionSource = typeof questionSources.$inferSelect;
export type NewQuestionSource = typeof questionSources.$inferInsert;
export type QuestionProgress = typeof questionProgress.$inferSelect;
export type NewQuestionProgress = typeof questionProgress.$inferInsert;
export type UserSolution = typeof userSolutions.$inferSelect;
export type NewUserSolution = typeof userSolutions.$inferInsert;
export type ResumeReadyProgress = typeof resumeReadyProgress.$inferSelect;
export type NewResumeReadyProgress = typeof resumeReadyProgress.$inferInsert;
export type ProjectCompletion = typeof projectCompletions.$inferSelect;
export type NewProjectCompletion = typeof projectCompletions.$inferInsert;

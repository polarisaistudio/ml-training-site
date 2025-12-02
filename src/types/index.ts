// Import and re-export database types
import type {
  Stage as StageType,
  NewStage,
  ContentType,
  NewContentType,
  ContentItem,
  NewContentItem,
  Question,
  NewQuestion,
  Project,
  NewProject,
  InterviewLog,
  NewInterviewLog,
  QuestionSource,
  NewQuestionSource,
} from '@/db/schema';

export type {
  NewStage,
  ContentType,
  NewContentType,
  ContentItem,
  NewContentItem,
  Question,
  NewQuestion,
  Project,
  NewProject,
  InterviewLog,
  NewInterviewLog,
  QuestionSource,
  NewQuestionSource,
};

export type Stage = StageType;

// Extended types with relations
export interface ContentItemWithRelations {
  id: number;
  stageId: number | null;
  contentTypeId: number | null;
  title: string;
  description: string | null;
  difficulty: string | null;
  isAvailable: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  stage?: {
    id: number;
    slug: string;
    name: string;
  } | null;
  contentType?: {
    id: number;
    slug: string;
    name: string;
  } | null;
  question?: {
    id: number;
    content: string | null;
    answer: string | null;
    sourceCompany: string | null;
    isVerified: boolean;
    tags: string | null;
  } | null;
  project?: {
    id: number;
    content: string | null;
    resumeBullets: string | null;
    estimatedHours: number | null;
  } | null;
}

export interface StageWithCounts extends Stage {
  totalItems: number;
  availableItems: number;
}

// Form state types
export interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

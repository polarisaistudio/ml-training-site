export type StageStatus = "locked" | "in-progress" | "completed";
export type TaskStatus = "locked" | "in-progress" | "completed";

export interface StageProgress {
  status: StageStatus;
  completed: number;
  total: number;
  percentage: number;
}

export interface UserProgress {
  stage1: StageProgress & {
    tasks: {
      sentimentAnalysis: TaskStatus;
      imageClassification: TaskStatus;
      recommendationSystem: TaskStatus;
    };
  };
  stage2: StageProgress & {
    isUnlocked: boolean;
  };
  stage3: StageProgress & {
    isUnlocked: boolean;
  };
  stats: {
    projectsCompleted: number;
    bqPracticed: number;
    dayStreak: number;
    totalHours: number;
  };
}

// Initial state for new users
export const initialProgress: UserProgress = {
  stage1: {
    status: "in-progress",
    completed: 0,
    total: 3,
    percentage: 0,
    tasks: {
      sentimentAnalysis: "in-progress",
      imageClassification: "locked",
      recommendationSystem: "locked",
    },
  },
  stage2: {
    status: "locked",
    completed: 0,
    total: 20,
    percentage: 0,
    isUnlocked: false,
  },
  stage3: {
    status: "locked",
    completed: 0,
    total: 35,
    percentage: 0,
    isUnlocked: false,
  },
  stats: {
    projectsCompleted: 0,
    bqPracticed: 0,
    dayStreak: 0,
    totalHours: 0,
  },
};

// Demo progress for showcasing the UI
export const demoProgress: UserProgress = {
  stage1: {
    status: "in-progress",
    completed: 1,
    total: 3,
    percentage: 33,
    tasks: {
      sentimentAnalysis: "completed",
      imageClassification: "in-progress",
      recommendationSystem: "locked",
    },
  },
  stage2: {
    status: "locked",
    completed: 0,
    total: 20,
    percentage: 0,
    isUnlocked: false,
  },
  stage3: {
    status: "locked",
    completed: 0,
    total: 35,
    percentage: 0,
    isUnlocked: false,
  },
  stats: {
    projectsCompleted: 1,
    bqPracticed: 5,
    dayStreak: 3,
    totalHours: 8,
  },
};

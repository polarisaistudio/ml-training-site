import { NextResponse } from "next/server";
import { db } from "@/db";
import { resumeReadyProgress, projectCompletions } from "@/db/schema";
import { getSessionId } from "@/lib/session";
import { eq } from "drizzle-orm";
import { getAllProjectTemplates } from "@/data/resume-ready/project-templates";

export async function GET() {
  try {
    const sessionId = await getSessionId();

    if (!sessionId) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    // Get or create progress record
    let progress = await db
      .select()
      .from(resumeReadyProgress)
      .where(eq(resumeReadyProgress.sessionId, sessionId))
      .then((rows) => rows[0]);

    if (!progress) {
      // Create new progress record
      const [newProgress] = await db
        .insert(resumeReadyProgress)
        .values({
          sessionId,
          readinessScore: 0,
          status: "not-started",
          completedProjects: [],
          resumeBulletsCount: 0,
          totalQuestionsReviewed: 0,
          expertCallBooked: false,
        })
        .returning();
      progress = newProgress;
    }

    // Get project completions for this user
    const completions = await db
      .select()
      .from(projectCompletions)
      .where(eq(projectCompletions.sessionId, sessionId));

    // Get all project templates
    const templates = getAllProjectTemplates();

    // Build response with project status
    const projectsWithStatus = templates.map((template) => {
      const completion = completions.find(
        (c) => c.projectTemplateId === template.id
      );
      return {
        ...template,
        status: completion?.status || "not-started",
        completedSteps: completion?.completedSteps || [],
        startedAt: completion?.startedAt,
        completedAt: completion?.completedAt,
      };
    });

    return NextResponse.json({
      progress: {
        readinessScore: progress.readinessScore,
        status: progress.status,
        completedProjects: progress.completedProjects,
        resumeBulletsCount: progress.resumeBulletsCount,
        resumeLastUpdated: progress.resumeLastUpdated,
        totalQuestionsReviewed: progress.totalQuestionsReviewed,
        expertCallBooked: progress.expertCallBooked,
        expertCallDate: progress.expertCallDate,
      },
      projects: projectsWithStatus,
    });
  } catch (error) {
    console.error("Error fetching resume-ready progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projectCompletions, resumeReadyProgress } from "@/db/schema";
import { getSessionId } from "@/lib/session";
import { eq, and } from "drizzle-orm";
import { getProjectTemplate, getAllProjectTemplates } from "@/data/resume-ready/project-templates";

export async function POST(request: NextRequest) {
  try {
    const sessionId = await getSessionId();

    if (!sessionId) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    const { projectId, resumeStyle } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId" },
        { status: 400 }
      );
    }

    // Verify project exists
    const template = getProjectTemplate(projectId);
    if (!template) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Get or create completion record
    let completion = await db
      .select()
      .from(projectCompletions)
      .where(
        and(
          eq(projectCompletions.sessionId, sessionId),
          eq(projectCompletions.projectTemplateId, projectId)
        )
      )
      .then((rows) => rows[0]);

    const now = new Date();

    if (!completion) {
      // Create completion record
      const [newCompletion] = await db
        .insert(projectCompletions)
        .values({
          sessionId,
          projectTemplateId: projectId,
          status: "completed",
          startedAt: now,
          completedAt: now,
          completedSteps: template.tutorialSteps.map((_, i) => i),
          selectedResumeStyle: resumeStyle || "technical",
          bulletsCopied: false,
          reviewedQuestions: [],
        })
        .returning();
      completion = newCompletion;
    } else {
      // Update to completed
      await db
        .update(projectCompletions)
        .set({
          status: "completed",
          completedAt: now,
          completedSteps: template.tutorialSteps.map((_, i) => i),
          selectedResumeStyle: resumeStyle || completion.selectedResumeStyle || "technical",
          updatedAt: now,
        })
        .where(eq(projectCompletions.id, completion.id));
    }

    // Update main progress
    const allCompletions = await db
      .select()
      .from(projectCompletions)
      .where(eq(projectCompletions.sessionId, sessionId));

    const completedCount = allCompletions.filter(
      (c) => c.status === "completed"
    ).length;

    const totalProjects = getAllProjectTemplates().length;
    const readinessScore = Math.round((completedCount / totalProjects) * 100);

    // Build completed projects array for the progress record
    const completedProjectsData = allCompletions
      .filter((c) => c.status === "completed")
      .map((c) => ({
        templateId: c.projectTemplateId,
        completedAt: c.completedAt?.toISOString() || now.toISOString(),
        selectedResumeStyle: (c.selectedResumeStyle as "technical" | "impact" | "fullStack") || "technical",
        questionsReviewed: c.reviewedQuestions || [],
      }));

    const newStatus = completedCount === totalProjects ? "completed" : "in-progress";

    await db
      .update(resumeReadyProgress)
      .set({
        readinessScore,
        status: newStatus,
        completedProjects: completedProjectsData,
        resumeBulletsCount: completedCount * 3, // 3 bullet styles per project
        resumeLastUpdated: now,
        updatedAt: now,
      })
      .where(eq(resumeReadyProgress.sessionId, sessionId));

    return NextResponse.json({
      success: true,
      readinessScore,
      completedCount,
      totalProjects,
    });
  } catch (error) {
    console.error("Error completing project:", error);
    return NextResponse.json(
      { error: "Failed to complete project" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projectCompletions, resumeReadyProgress } from "@/db/schema";
import { getSessionId } from "@/lib/session";
import { eq, and } from "drizzle-orm";
import { getProjectTemplate } from "@/data/resume-ready/project-templates";

export async function POST(request: NextRequest) {
  try {
    const sessionId = await getSessionId();

    if (!sessionId) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    const { projectId, stepIndex } = await request.json();

    if (!projectId || stepIndex === undefined) {
      return NextResponse.json(
        { error: "Missing projectId or stepIndex" },
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

    if (!completion) {
      // Create new completion record
      const [newCompletion] = await db
        .insert(projectCompletions)
        .values({
          sessionId,
          projectTemplateId: projectId,
          status: "in-progress",
          startedAt: new Date(),
          completedSteps: [stepIndex],
          reviewedQuestions: [],
        })
        .returning();
      completion = newCompletion;

      // Update main progress to in-progress if not started
      await db
        .update(resumeReadyProgress)
        .set({ status: "in-progress", updatedAt: new Date() })
        .where(eq(resumeReadyProgress.sessionId, sessionId));
    } else {
      // Toggle step in completedSteps array
      const currentSteps = completion.completedSteps || [];
      let newSteps: number[];

      if (currentSteps.includes(stepIndex)) {
        newSteps = currentSteps.filter((s) => s !== stepIndex);
      } else {
        newSteps = [...currentSteps, stepIndex].sort((a, b) => a - b);
      }

      // Check if all steps are completed
      const allStepsCompleted = newSteps.length === template.tutorialSteps.length;
      const newStatus = allStepsCompleted ? "tutorial-complete" : "in-progress";

      await db
        .update(projectCompletions)
        .set({
          completedSteps: newSteps,
          status: newStatus,
          updatedAt: new Date(),
        })
        .where(eq(projectCompletions.id, completion.id));

      completion = {
        ...completion,
        completedSteps: newSteps,
        status: newStatus,
      };
    }

    return NextResponse.json({
      success: true,
      completedSteps: completion.completedSteps,
      status: completion.status,
    });
  } catch (error) {
    console.error("Error toggling step:", error);
    return NextResponse.json(
      { error: "Failed to toggle step" },
      { status: 500 }
    );
  }
}

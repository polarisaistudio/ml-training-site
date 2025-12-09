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

    const { projectId, questionId } = await request.json();

    if (!projectId || !questionId) {
      return NextResponse.json(
        { error: "Missing projectId or questionId" },
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

    // Get completion record
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
      // Create new completion record with this question
      const [newCompletion] = await db
        .insert(projectCompletions)
        .values({
          sessionId,
          projectTemplateId: projectId,
          status: "in-progress",
          startedAt: new Date(),
          completedSteps: [],
          reviewedQuestions: [questionId],
        })
        .returning();
      completion = newCompletion;
    } else {
      // Toggle question in reviewedQuestions array
      const currentQuestions = completion.reviewedQuestions || [];
      let newQuestions: string[];

      if (currentQuestions.includes(questionId)) {
        newQuestions = currentQuestions.filter((q) => q !== questionId);
      } else {
        newQuestions = [...currentQuestions, questionId];
      }

      await db
        .update(projectCompletions)
        .set({
          reviewedQuestions: newQuestions,
          updatedAt: new Date(),
        })
        .where(eq(projectCompletions.id, completion.id));

      completion = {
        ...completion,
        reviewedQuestions: newQuestions,
      };
    }

    // Update total questions reviewed in main progress
    const allCompletions = await db
      .select()
      .from(projectCompletions)
      .where(eq(projectCompletions.sessionId, sessionId));

    const totalQuestionsReviewed = allCompletions.reduce(
      (sum, c) => sum + (c.reviewedQuestions?.length || 0),
      0
    );

    await db
      .update(resumeReadyProgress)
      .set({
        totalQuestionsReviewed,
        updatedAt: new Date(),
      })
      .where(eq(resumeReadyProgress.sessionId, sessionId));

    return NextResponse.json({
      success: true,
      reviewedQuestions: completion.reviewedQuestions,
      totalQuestionsReviewed,
    });
  } catch (error) {
    console.error("Error toggling question:", error);
    return NextResponse.json(
      { error: "Failed to toggle question" },
      { status: 500 }
    );
  }
}

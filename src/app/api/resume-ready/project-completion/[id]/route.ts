import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projectCompletions } from "@/db/schema";
import { getSessionId } from "@/lib/session";
import { eq, and } from "drizzle-orm";
import { getProjectTemplate } from "@/data/resume-ready/project-templates";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const sessionId = await getSessionId();

    if (!sessionId) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    // Get project template
    const template = getProjectTemplate(projectId);
    if (!template) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Get completion status
    const completion = await db
      .select()
      .from(projectCompletions)
      .where(
        and(
          eq(projectCompletions.sessionId, sessionId),
          eq(projectCompletions.projectTemplateId, projectId)
        )
      )
      .then((rows) => rows[0]);

    return NextResponse.json({
      project: template,
      completion: completion
        ? {
            status: completion.status,
            startedAt: completion.startedAt,
            completedAt: completion.completedAt,
            completedSteps: completion.completedSteps,
            selectedResumeStyle: completion.selectedResumeStyle,
            bulletsCopied: completion.bulletsCopied,
            reviewedQuestions: completion.reviewedQuestions,
          }
        : {
            status: "not-started",
            completedSteps: [],
            reviewedQuestions: [],
          },
    });
  } catch (error) {
    console.error("Error fetching project completion:", error);
    return NextResponse.json(
      { error: "Failed to fetch project completion" },
      { status: 500 }
    );
  }
}

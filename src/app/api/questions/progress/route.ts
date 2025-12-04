import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { questionProgress } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getOrCreateSessionId } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const sessionId = await getOrCreateSessionId();
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');

    if (!questionId) {
      return NextResponse.json(
        { error: 'questionId is required' },
        { status: 400 }
      );
    }

    const progress = await db
      .select()
      .from(questionProgress)
      .where(
        and(
          eq(questionProgress.questionId, parseInt(questionId)),
          eq(questionProgress.sessionId, sessionId)
        )
      )
      .limit(1);

    return NextResponse.json({
      progress: progress[0] || null,
      sessionId,
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = await getOrCreateSessionId();
    const body = await request.json();
    const { questionId, completed, timeSpent, notes, viewedAnswer } = body;

    if (!questionId) {
      return NextResponse.json(
        { error: 'questionId is required' },
        { status: 400 }
      );
    }

    // Check if progress exists
    const existing = await db
      .select()
      .from(questionProgress)
      .where(
        and(
          eq(questionProgress.questionId, questionId),
          eq(questionProgress.sessionId, sessionId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing progress
      const updateData: Record<string, unknown> = {
        updatedAt: new Date(),
      };

      if (completed !== undefined) {
        updateData.completed = completed;
        if (completed) {
          updateData.completedAt = new Date();
        }
      }
      if (timeSpent !== undefined) updateData.timeSpent = timeSpent;
      if (notes !== undefined) updateData.notes = notes;
      if (viewedAnswer !== undefined) updateData.viewedAnswer = viewedAnswer;

      await db
        .update(questionProgress)
        .set(updateData)
        .where(eq(questionProgress.id, existing[0].id));

      return NextResponse.json({ success: true, updated: true });
    } else {
      // Insert new progress
      await db.insert(questionProgress).values({
        questionId,
        sessionId,
        completed: completed || false,
        timeSpent: timeSpent || 0,
        notes: notes || null,
        viewedAnswer: viewedAnswer || false,
        completedAt: completed ? new Date() : null,
      });

      return NextResponse.json({ success: true, created: true });
    }
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}

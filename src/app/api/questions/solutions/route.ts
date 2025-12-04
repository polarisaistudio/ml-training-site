import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userSolutions } from '@/db/schema';
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

    const solution = await db
      .select()
      .from(userSolutions)
      .where(
        and(
          eq(userSolutions.questionId, parseInt(questionId)),
          eq(userSolutions.sessionId, sessionId)
        )
      )
      .limit(1);

    return NextResponse.json({
      solution: solution[0] || null,
      sessionId,
    });
  } catch (error) {
    console.error('Error fetching solution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solution' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = await getOrCreateSessionId();
    const body = await request.json();
    const { questionId, code, language = 'python' } = body;

    if (!questionId) {
      return NextResponse.json(
        { error: 'questionId is required' },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: 'code is required' },
        { status: 400 }
      );
    }

    // Check if solution exists
    const existing = await db
      .select()
      .from(userSolutions)
      .where(
        and(
          eq(userSolutions.questionId, questionId),
          eq(userSolutions.sessionId, sessionId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing solution
      await db
        .update(userSolutions)
        .set({
          code,
          language,
          updatedAt: new Date(),
        })
        .where(eq(userSolutions.id, existing[0].id));

      return NextResponse.json({ success: true, updated: true });
    } else {
      // Insert new solution
      await db.insert(userSolutions).values({
        questionId,
        sessionId,
        code,
        language,
      });

      return NextResponse.json({ success: true, created: true });
    }
  } catch (error) {
    console.error('Error saving solution:', error);
    return NextResponse.json(
      { error: 'Failed to save solution' },
      { status: 500 }
    );
  }
}

'use server';

import { revalidatePath } from 'next/cache';
import { db, contentItems, questions, interviewLogs, questionSources, stages, contentTypes } from '@/db';
import { eq } from 'drizzle-orm';

export async function createQuestion(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const stageId = formData.get('stageId') as string;
  const contentTypeId = formData.get('contentTypeId') as string;
  const difficulty = formData.get('difficulty') as string;
  const content = formData.get('content') as string;
  const answer = formData.get('answer') as string;
  const sourceCompany = formData.get('sourceCompany') as string;
  const isVerified = formData.get('isVerified') === 'true';
  const isAvailable = formData.get('isAvailable') === 'true';
  const tags = formData.get('tags') as string;
  const interviewLogId = formData.get('interviewLogId') as string;

  try {
    // Create content item
    const [contentItem] = await db
      .insert(contentItems)
      .values({
        title,
        description: description || null,
        stageId: stageId ? parseInt(stageId) : null,
        contentTypeId: contentTypeId ? parseInt(contentTypeId) : null,
        difficulty: difficulty || null,
        isAvailable,
        order: 0,
      })
      .returning();

    // Create question
    const [question] = await db
      .insert(questions)
      .values({
        contentItemId: contentItem.id,
        content: content || null,
        answer: answer || null,
        sourceCompany: sourceCompany || null,
        isVerified,
        tags: tags ? JSON.stringify(tags.split(',').map((t: string) => t.trim())) : null,
      })
      .returning();

    // Link to interview log if provided
    if (interviewLogId) {
      await db.insert(questionSources).values({
        questionId: question.id,
        interviewLogId: parseInt(interviewLogId),
      });
    }

    revalidatePath('/admin/questions');
    revalidatePath('/questions');
    revalidatePath('/');

    return { success: true, id: contentItem.id };
  } catch (error) {
    console.error('Error creating question:', error);
    return { success: false, error: 'Failed to create question' };
  }
}

export async function updateQuestion(id: number, formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const stageId = formData.get('stageId') as string;
  const contentTypeId = formData.get('contentTypeId') as string;
  const difficulty = formData.get('difficulty') as string;
  const content = formData.get('content') as string;
  const answer = formData.get('answer') as string;
  const sourceCompany = formData.get('sourceCompany') as string;
  const isVerified = formData.get('isVerified') === 'true';
  const isAvailable = formData.get('isAvailable') === 'true';
  const tags = formData.get('tags') as string;

  try {
    // Update content item
    await db
      .update(contentItems)
      .set({
        title,
        description: description || null,
        stageId: stageId ? parseInt(stageId) : null,
        contentTypeId: contentTypeId ? parseInt(contentTypeId) : null,
        difficulty: difficulty || null,
        isAvailable,
        updatedAt: new Date(),
      })
      .where(eq(contentItems.id, id));

    // Update question
    await db
      .update(questions)
      .set({
        content: content || null,
        answer: answer || null,
        sourceCompany: sourceCompany || null,
        isVerified,
        tags: tags ? JSON.stringify(tags.split(',').map((t: string) => t.trim())) : null,
      })
      .where(eq(questions.contentItemId, id));

    revalidatePath('/admin/questions');
    revalidatePath(`/admin/questions/${id}/edit`);
    revalidatePath(`/questions/${id}`);
    revalidatePath('/questions');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error updating question:', error);
    return { success: false, error: 'Failed to update question' };
  }
}

export async function deleteQuestion(id: number) {
  try {
    // Delete question sources first
    const question = await db.select().from(questions).where(eq(questions.contentItemId, id)).limit(1);
    if (question[0]) {
      await db.delete(questionSources).where(eq(questionSources.questionId, question[0].id));
    }

    // Delete question
    await db.delete(questions).where(eq(questions.contentItemId, id));

    // Delete content item
    await db.delete(contentItems).where(eq(contentItems.id, id));

    revalidatePath('/admin/questions');
    revalidatePath('/questions');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error deleting question:', error);
    return { success: false, error: 'Failed to delete question' };
  }
}

export async function createInterviewLog(formData: FormData) {
  const company = formData.get('company') as string;
  const position = formData.get('position') as string;
  const interviewDate = formData.get('interviewDate') as string;
  const roundType = formData.get('roundType') as string;
  const questionsAsked = formData.get('questionsAsked') as string;
  const difficulty = formData.get('difficulty') as string;
  const result = formData.get('result') as string;
  const notes = formData.get('notes') as string;

  try {
    const [log] = await db
      .insert(interviewLogs)
      .values({
        company,
        position: position || null,
        interviewDate: interviewDate || null,
        roundType: roundType || null,
        questionsAsked: questionsAsked || null,
        difficulty: difficulty || null,
        result: result || null,
        notes: notes || null,
      })
      .returning();

    revalidatePath('/admin/interview-logs');

    return { success: true, id: log.id };
  } catch (error) {
    console.error('Error creating interview log:', error);
    return { success: false, error: 'Failed to create interview log' };
  }
}

export async function updateInterviewLog(id: number, formData: FormData) {
  const company = formData.get('company') as string;
  const position = formData.get('position') as string;
  const interviewDate = formData.get('interviewDate') as string;
  const roundType = formData.get('roundType') as string;
  const questionsAsked = formData.get('questionsAsked') as string;
  const difficulty = formData.get('difficulty') as string;
  const result = formData.get('result') as string;
  const notes = formData.get('notes') as string;

  try {
    await db
      .update(interviewLogs)
      .set({
        company,
        position: position || null,
        interviewDate: interviewDate || null,
        roundType: roundType || null,
        questionsAsked: questionsAsked || null,
        difficulty: difficulty || null,
        result: result || null,
        notes: notes || null,
        updatedAt: new Date(),
      })
      .where(eq(interviewLogs.id, id));

    revalidatePath('/admin/interview-logs');
    revalidatePath(`/admin/interview-logs/${id}/edit`);

    return { success: true };
  } catch (error) {
    console.error('Error updating interview log:', error);
    return { success: false, error: 'Failed to update interview log' };
  }
}

export async function deleteInterviewLog(id: number) {
  try {
    // Delete related question sources first
    await db.delete(questionSources).where(eq(questionSources.interviewLogId, id));

    // Delete interview log
    await db.delete(interviewLogs).where(eq(interviewLogs.id, id));

    revalidatePath('/admin/interview-logs');

    return { success: true };
  } catch (error) {
    console.error('Error deleting interview log:', error);
    return { success: false, error: 'Failed to delete interview log' };
  }
}

export async function getStagesAndContentTypes() {
  const [stagesList, contentTypesList] = await Promise.all([
    db.select().from(stages).orderBy(stages.order),
    db.select().from(contentTypes).orderBy(contentTypes.id),
  ]);

  return { stages: stagesList, contentTypes: contentTypesList };
}

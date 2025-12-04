import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'ml_prep_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

/**
 * Get or create a session ID for anonymous user tracking
 */
export async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existingSession = cookieStore.get(SESSION_COOKIE_NAME);

  if (existingSession?.value) {
    return existingSession.value;
  }

  // Generate a new session ID
  const newSessionId = crypto.randomUUID();

  // Set the cookie
  cookieStore.set(SESSION_COOKIE_NAME, newSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  return newSessionId;
}

/**
 * Get existing session ID (returns null if none exists)
 */
export async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value || null;
}

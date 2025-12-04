import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "ml_prep_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

/**
 * Get or create a session ID for anonymous user tracking
 * Note: Cookie is set by middleware, this only reads
 */
export async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existingSession = cookieStore.get(SESSION_COOKIE_NAME);

  // Cookie should be set by middleware, but fallback to a temporary ID if not
  if (existingSession?.value) {
    return existingSession.value;
  }

  // Return a temporary session ID (middleware will set the cookie on next request)
  return crypto.randomUUID();
}

/**
 * Get existing session ID (returns null if none exists)
 */
export async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value || null;
}

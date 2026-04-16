import React, { createContext, useContext } from 'react';

/**
 * Replacement for next-auth/react.
 * Vue wrapper provides auth state from Pinia store via EduAuthProvider.
 */

export interface EduUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface EduSession {
  user: EduUser;
}

interface SessionContextValue {
  data: EduSession | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

const SessionContext = createContext<SessionContextValue>({
  data: null,
  status: 'unauthenticated',
});

interface EduAuthProviderProps {
  session: EduSession | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  children: React.ReactNode;
}

/**
 * Wraps React components that need session access.
 * Vue wrapper pages create this provider with auth state from Pinia.
 */
export function EduAuthProvider({ session, status, children }: EduAuthProviderProps) {
  return (
    <SessionContext.Provider value={{ data: session, status }}>
      {children}
    </SessionContext.Provider>
  );
}

/**
 * Drop-in replacement for next-auth's useSession().
 */
export function useSession() {
  return useContext(SessionContext);
}

/**
 * Sign in via the Python backend.
 * Returns { ok, error? }.
 */
export async function signIn(
  _provider: string,
  options?: { email?: string; password?: string; redirect?: boolean; callbackUrl?: string },
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: options?.email,
        password: options?.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { ok: false, error: data.detail || 'Login failed' };
    }

    // Store token
    if (data.access_token) {
      localStorage.setItem('edu_token', data.access_token);
    }

    // Notify Vue side about auth change
    window.dispatchEvent(new CustomEvent('edu-auth-change', { detail: data }));

    if (options?.redirect !== false && options?.callbackUrl) {
      if (window.__VUE_ROUTER_PUSH__) {
        window.__VUE_ROUTER_PUSH__(options.callbackUrl);
      }
    }

    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error' };
  }
}

/**
 * Sign out — clears token and notifies Vue side.
 */
export async function signOut(options?: { callbackUrl?: string }) {
  localStorage.removeItem('edu_token');
  window.dispatchEvent(new CustomEvent('edu-auth-change', { detail: null }));

  if (options?.callbackUrl && window.__VUE_ROUTER_PUSH__) {
    window.__VUE_ROUTER_PUSH__(options.callbackUrl);
  }
}

declare global {
  interface Window {
    __VUE_ROUTER_PUSH__?: (path: string) => void;
  }
}

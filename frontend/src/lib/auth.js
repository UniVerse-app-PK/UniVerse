import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './api';

export function saveSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function savePendingEmail(email) {
  localStorage.setItem('pendingEmail', email);
}

export function getPendingEmail() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('pendingEmail') || '';
}

// Client-side guard for pages that require login. Returns false (and kicks
// off a redirect to /login) until a token is confirmed present, so the
// caller can hold off rendering any protected content in the meantime -
// otherwise a logged-out visitor briefly sees the real form/data before
// the redirect kicks in.
export function useRequireAuth() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    setReady(true);
  }, [router]);

  return ready;
}

export function isAdmin() {
  const user = getUser();
  return user?.role === 'admin';
}

export function isAdminVerified() {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('adminVerified') === 'true';
}

export function setAdminVerified(val) {
  if (typeof window === 'undefined') return;
  if (val) {
    sessionStorage.setItem('adminVerified', 'true');
  } else {
    sessionStorage.removeItem('adminVerified');
  }
}

export async function refreshUserSession() {
  const data = await api.get('/auth/me', { auth: true });
  saveSession(getToken(), data.user);
  return data.user;
}


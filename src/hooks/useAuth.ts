export type AuthUser = { id: string; email: string; firstName?: string; lastName?: string };

export function getAuth() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? (JSON.parse(userStr) as AuthUser) : null;
  return { token, user };
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // if you stored other auth bits, clear them here too
}

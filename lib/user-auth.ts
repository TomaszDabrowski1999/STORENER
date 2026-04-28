type SessionUser = {
  id: number;
  fullName: string;
  email: string;
};

const SESSION_KEY = "shop_user_session";

export function saveUserSession(user: SessionUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): SessionUser | null {
  if (typeof window === "undefined") return null;

  const saved = localStorage.getItem(SESSION_KEY);
  return saved ? JSON.parse(saved) : null;
}

export function isUserLoggedIn() {
  return !!getCurrentUser();
}
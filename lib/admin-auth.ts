const ADMIN_SESSION_KEY = "admin_session";

const ADMIN_EMAIL = "admin@sklep.pl";
const ADMIN_PASSWORD = "admin123";

export function loginAdmin(email: string, password: string) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_SESSION_KEY, "true");
    return true;
  }

  return false;
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminLoggedIn() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

"use client";

import { useRouter } from "next/navigation";
import { logoutAdmin } from "../lib/admin-auth";

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg bg-red-600 px-5 py-3 text-white"
    >
      Wyloguj
    </button>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn } from "../lib/admin-auth";

type AdminGuardProps = {
  children: React.ReactNode;
};

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const loggedIn = isAdminLoggedIn();

    if (!loggedIn) {
      router.push("/admin/login");
      return;
    }

    setIsAllowed(true);
  }, [router]);

  if (!isAllowed) {
    return (
      <main className="min-h-screen bg-gray-50 p-10">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-lg font-semibold">Sprawdzanie dostępu...</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isUserLoggedIn } from "../lib/user-auth";

type UserGuardProps = {
  children: React.ReactNode;
};

export default function UserGuard({ children }: UserGuardProps) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const loggedIn = isUserLoggedIn();

    if (!loggedIn) {
      router.push("/logowanie");
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
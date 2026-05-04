"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type AdminGuardProps = {
  children: React.ReactNode;
};

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/logowanie");
      return;
    }

    if (session.user.role !== "ADMIN") {
      router.push("/");
    }
  }, [router, session, status]);

  if (status === "loading" || !session?.user || session.user.role !== "ADMIN") {
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

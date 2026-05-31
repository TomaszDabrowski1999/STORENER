"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type UserGuardProps = {
  children: React.ReactNode;
};

export default function UserGuard({ children }: UserGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      const callbackUrl = pathname ? `?callbackUrl=${encodeURIComponent(pathname)}` : "";
      router.replace(`/logowanie${callbackUrl}`);
    }
  }, [pathname, router, status]);

  if (status === "loading" || status === "unauthenticated") {
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

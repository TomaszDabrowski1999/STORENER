import { Suspense } from "react";
import HomeContent from "./HomeContent";

export default function HomePage() {
  return (
    <Suspense fallback={<div>Ładowanie...</div>}>
      <HomeContent />
    </Suspense>
  );
}
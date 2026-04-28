"use client";

import { Suspense } from "react";
import ProduktyContent from "./ProduktyContent";

export default function ProduktyPage() {
  return (
    <Suspense fallback={<div>Ładowanie...</div>}>
      <ProduktyContent />
    </Suspense>
  );
}
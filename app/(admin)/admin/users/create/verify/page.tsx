"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import VerifyContent from "./VerifyContent";

export default function ManualVerifyPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div className="p-10">Memuat...</div>}>
        <VerifyContent />
      </Suspense>
    </AdminLayout>
  );
}
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderSpin } from "@/components/Loader";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderSpin text="Redirigiendo..." />
    </div>
  );
}

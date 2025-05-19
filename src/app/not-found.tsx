// not found page
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404 - Página no encontrada</h1>
      <Separator className="my-4 w-1/2" />
      <p className="text-lg">La página que buscas no existe.</p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => router.push("/dashboard")}
      >
        <ArrowLeft className="mr-2" />
        Volver al Dashboard
      </Button>
    </div>
  );
}

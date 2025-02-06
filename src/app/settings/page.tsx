"use client";

import UpdateChecker from "@/components/updateChecker";
import UpdateModal from "@/components/updateModal";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Settings() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <Button variant={"outline"} className="flex mr-5" onClick={handleBack}>
        <ArrowLeft />
      </Button>
      <h1>Settings</h1>
      <UpdateChecker />
      <UpdateModal />
    </div>
  );
}

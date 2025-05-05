import { Loader2 } from "lucide-react";
export default function PageLoading() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
    </div>
  );
}

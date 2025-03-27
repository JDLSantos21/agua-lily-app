import { Loader2 } from "lucide-react";

export const NonInteractiveLoader = ({ text }: { text: string }) => {
  return (
    <div className="fixed inset-0 bg-gray-200/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-center font-medium after:absolute after:ml-1 after:animate-dots">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

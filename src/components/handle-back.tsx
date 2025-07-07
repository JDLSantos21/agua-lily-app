import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HandleBack({
  customClassName,
}: {
  customClassName?: string;
}) {
  const router = useRouter();

  const handleBack = () => {
    router.push("/dashboard");
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center text-gray-500 hover:text-gray-700`}
    >
      <ArrowLeft className={`h-5 w-5 ${customClassName}`} />
    </button>
  );
}

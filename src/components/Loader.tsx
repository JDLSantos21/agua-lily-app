import { Loader } from "lucide-react";

export const LoaderSpin = ({ className, text='Cargando...' }: {
  className?: string;
  text?: string;
}) => {
  return (
    <div className={`${className} flex flex-col justify-center items-center animate-pulse w-full h-[200px]`}>
      <Loader className="animate-spin w-10 h-10" />
      <span>{text}</span>
    </div>
  );
};
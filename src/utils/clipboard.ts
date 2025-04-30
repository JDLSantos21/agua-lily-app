import { toast } from "sonner";

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.info("Texto copiado al portapapeles");
  } catch (error) {
    toast.error("Error al copiar al portapapeles");
  }
};

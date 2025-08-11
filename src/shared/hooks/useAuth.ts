import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export function useAuth() {
  const { login, logout, accessToken } = useAuthStore();

  const router = useRouter();

  const signIn = useCallback(
    async (user: string, pass: string) => {
      await login(user, pass);
      router.push("/dashboard");
    },
    [login, router]
  );

  const signOut = useCallback(async () => {
    const succes = await logout();
    if (succes) {
      router.push("/login");
    } else {
      toast.error("Ocurrió un error al cerrar sesión");
      return;
    }
  }, [login, router]);

  return {
    accessToken,
    signIn,
    signOut,
  };
}

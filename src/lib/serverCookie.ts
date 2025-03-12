import { cookies } from 'next/headers';

export async function getServerCookie(name: string): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value || null;
}

export async function getAllAuthData() {
  const cookieStore = await cookies();
  
  return {
    token: cookieStore.get('token')?.value || null,
    role: cookieStore.get('role')?.value || null,
    name: cookieStore.get('name')?.value || null,
    user_id: cookieStore.get('user_id')?.value ? Number(cookieStore.get('user_id')?.value) : null
  };
}

// Esta función verifica si hay un usuario autenticado desde el servidor
export async function isAuthenticated(): Promise<boolean> {
  const token = await getServerCookie('token');
  return token !== null;
}
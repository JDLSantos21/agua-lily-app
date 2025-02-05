// src/services/authService.ts
export const login = async (username: string, password: string) => {
  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    console.log(await response.json());
    throw new Error("Usuario o contraseña incorrecta.");
  }

  const data = await response.json();
  console.log(data);
  return data;
};

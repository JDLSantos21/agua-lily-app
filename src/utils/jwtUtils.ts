import {jwtDecode} from "jwt-decode";

interface JwtPayload {
  exp: number; // Fecha de expiración en segundos (Unix timestamp)
  id: number;
  username: string;
  role: string;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Tiempo actual en segundos
    return decoded.exp < currentTime;
  } catch (error) {
    console.log("Error decodificando el token:", error);
    return true; // Si hay un error, asumimos que el token es inválido
  }
};
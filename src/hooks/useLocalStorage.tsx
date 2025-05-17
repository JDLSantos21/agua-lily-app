// src/hooks/useLocalStorage.ts
"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // Estado para almacenar nuestro valor
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Inicializar storedValue desde localStorage
  useEffect(() => {
    // Prevenir ejecución en SSR
    if (typeof window === "undefined") {
      return;
    }

    try {
      // Obtener del localStorage por key
      const item = window.localStorage.getItem(key);
      // Parsear almacenado json o si no existe retornar initialValue
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      // Si hay error retornar initialValue
      console.error(error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  // Función para actualizar localStorage y state
  const setValue = (value: T) => {
    try {
      // Permitir que value sea una función
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Guardar state
      setStoredValue(valueToStore);
      // Guardar en localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

import { useState, useEffect } from "react";

export function useResponsiveItemsPerPage(
  defaultRowHeight: number = 60,
  offsetRem: number = 13,
  remSize: number = 16
) {
  const [itemsPerPage, setItemsPerPage] = useState<number>(1);

  useEffect(() => {
    const calculateItemsPerPage = () => {
      // Calculamos el alto disponible y dividimos por el alto estimado de cada fila
      const containerHeight = window.innerHeight - offsetRem * remSize;
      return Math.max(Math.floor(containerHeight / defaultRowHeight), 1);
    };

    const updateItemsPerPage = () => {
      setItemsPerPage(calculateItemsPerPage());
    };

    updateItemsPerPage();

    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, [defaultRowHeight, offsetRem, remSize]);

  return itemsPerPage;
}

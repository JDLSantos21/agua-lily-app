// hooks/useFetchFilteredStock.ts
import { useState, useCallback, useEffect } from "react";
import { fetchFilteredStock } from "@/api/materials";
import { Material } from "@/lib/types";

export function useFetchFilteredStock(query?: string) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log("se hizo el fetch");
    try {
      const data = await fetchFilteredStock(query || "");
      setMaterials(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  return { materials, loading, error, setMaterials, refetch: fetchMaterials };
}

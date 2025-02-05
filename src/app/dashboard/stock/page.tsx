"use client";

import StockTable from "@/ui/stock/stock-table";
import StockSearch from "@/ui/stock/search";
import { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function Stock() {
  const [query, setQuery] = useState("");

  return (
    <ProtectedRoute requiredRole="operador">
      {/* Pasamos setQuery para actualizar el estado */}
      <StockSearch placeholder="Buscar material..." onSearch={setQuery} />
      <StockTable query={query} />
    </ProtectedRoute>
  );
}

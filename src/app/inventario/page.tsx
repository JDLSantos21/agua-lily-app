// ui/stock/Stock.tsx
"use client";

import { useState, memo } from "react";
import StockTable from "@/ui/stock/stock-table";
import StockSearch from "@/ui/stock/search";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function Stock() {
  const [query, setQuery] = useState("");

  return (
    <ProtectedRoute requiredRole="operador">
      <StockSearch placeholder="Buscar material..." onSearch={setQuery} />
      <StockTable query={query} />
    </ProtectedRoute>
  );
}

export default memo(Stock);

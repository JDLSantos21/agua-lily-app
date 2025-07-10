"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";

interface VehicleSearchProps {
  onSearch: (searchTerm: string) => void;
}

export function VehicleSearch({ onSearch }: VehicleSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce search to avoid too many rerenders
  const debouncedSearch = useDebouncedCallback((term: string) => {
    onSearch(term);
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        id="search"
        type="search"
        placeholder="Buscar vehículo por tag (ej: F-01)"
        className="pl-10 pr-10 h-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        value={searchTerm}
        onChange={handleSearch}
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
          onClick={clearSearch}
        >
          <X className="h-4 w-4 text-gray-400" />
        </Button>
      )}
    </div>
  );
}

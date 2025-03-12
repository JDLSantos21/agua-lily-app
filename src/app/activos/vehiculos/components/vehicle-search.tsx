"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

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

  return (
    <div className="flex flex-col space-y-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="search"
          type="search"
          placeholder="Buscar por tag (ejemplo: F-01)"
          className="pl-9"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
}
"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

export default function StockSearch({
  placeholder,
  onSearch,
}: {
  placeholder: string;
  onSearch: (query: string) => void;
}) {
  const handleSearch = useDebouncedCallback((term: string) => {
    onSearch(term);
  }, 500);

  return (
    <div className="relative max-w-md mb-6">
      <label htmlFor="search" className="sr-only">
        Buscar
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          onChange={(event) => handleSearch(event.target.value)}
          className="pl-10 pr-4 py-2.5 bg-gray-50/50 border-gray-200/50 rounded-lg focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

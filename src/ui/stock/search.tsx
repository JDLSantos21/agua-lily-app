"use client";

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
  console.log("renderizando Stock...");
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        onChange={(event) => handleSearch(event.target.value)}
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
      />
      <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}

"use client";

import { LayoutGrid, Globe, Lock } from "lucide-react";

export type BookmarkFilter = "all" | "public" | "private";

export const bookmarkFilters: { value: BookmarkFilter; label: string; icon: any }[] = [
  { value: "all", label: "All Bookmarks", icon: LayoutGrid },
  { value: "public", label: "Public", icon: Globe },
  { value: "private", label: "Private", icon: Lock },
];

type FilterButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: any;
  className?: string;
};

function FilterButton({
  label,
  active,
  onClick,
  icon: Icon,
  className = "",
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 text-left text-sm font-semibold transition-all duration-200 active:scale-95 ${className} ${
        active
          ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30 shadow-inner"
          : "text-gray-400 border border-transparent hover:bg-gray-900/60 hover:text-white"
      }`}
    >
      <Icon className={`h-4 w-4 ${active ? "text-indigo-400" : "text-gray-500"}`} />
      {label}
    </button>
  );
}

type FilterPanelProps = {
  filter: BookmarkFilter;
  onFilterChange: (filter: BookmarkFilter) => void;
};

export default function FilterPanel({
  filter,
  onFilterChange,
}: FilterPanelProps) {
  return (
    <>
      {/* --- MOBILE CONTAINER NAV PANEL (TOP SCROLLABLE BAR) --- */}
      <nav className="flex gap-2 overflow-x-auto border-b border-gray-800/60 bg-gray-950/20 p-4 scrollbar-none md:hidden backdrop-blur-md">
        {bookmarkFilters.map(({ value, label, icon }) => (
          <FilterButton
            key={value}
            label={label}
            icon={icon}
            active={filter === value}
            onClick={() => onFilterChange(value)}
            className="shrink-0 rounded-full px-4 py-2"
          />
        ))}
      </nav>

      {/* --- DESKTOP CONTAINER PANEL (LEFT SIDEBAR ASSET) --- */}
      <aside className="hidden w-60 shrink-0 p-6 md:block">
        <p className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-gray-500">
          Collections
        </p>
        <nav className="flex flex-col gap-1.5">
          {bookmarkFilters.map(({ value, label, icon }) => (
            <FilterButton
              key={value}
              label={label}
              icon={icon}
              active={filter === value}
              onClick={() => onFilterChange(value)}
              className="rounded-xl px-4 py-2.5"
            />
          ))}
        </nav>
      </aside>
    </>
  );
}

"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Flower } from "@/type/flower";

interface FlowerCardProps {
  flower: Flower;
  isSelected: boolean;
  selectedCount: number;
  onToggle: (flower: Flower) => void;
}

export function FlowerCard({ flower, isSelected, selectedCount, onToggle }: FlowerCardProps) {
  const t = useTranslations("flowers");

  return (
    <button
      type="button"
      onClick={() => onToggle(flower)}
      aria-pressed={isSelected}
      aria-label={`${isSelected ? "Remove" : "Add"} ${t(flower.nameKey)} to bouquet`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 ${
        isSelected ? "border-rose-400 shadow-rose-100" : "border-stone-200 hover:border-rose-300"
      }`}
    >
      {/* Count badge */}
      {selectedCount > 0 && (
        <span className="absolute right-2.5 top-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs font-semibold text-white shadow">
          {selectedCount}
        </span>
      )}

      {/* Checkmark */}
      <span
        className={`absolute left-2.5 top-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 ${
          isSelected ? "bg-rose-500 opacity-100" : "bg-white/70 opacity-0 group-hover:opacity-100"
        }`}
      >
        <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M2 6l3 3 5-5" />
        </svg>
      </span>

      {/* Image — explicit width/height prevents fill from escaping the card */}
      <div className="h-44 w-full overflow-hidden bg-stone-100">
        <Image
          src={flower.imagePath}
          alt={t(flower.altKey)}
          width={400}
          height={176}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Name + category */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-sm font-semibold leading-tight text-stone-800">
          {t(flower.nameKey)}
        </span>
        <span className="text-xs capitalize text-stone-400">{flower.category}</span>
      </div>

      {/* Bottom accent bar */}
      <div className={`h-1 w-full transition-all duration-300 ${isSelected ? "bg-rose-400" : "bg-transparent group-hover:bg-rose-200"}`} />
    </button>
  );
}
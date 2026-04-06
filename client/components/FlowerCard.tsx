"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Flower } from "@/type/flower";

export const FLOWER_COLORS = [
  { id: "red",    label: "Red",    hex: "#ef4444" },
  { id: "pink",   label: "Pink",   hex: "#f472b6" },
  { id: "white",  label: "White",  hex: "#f5f5f4" },
  { id: "yellow", label: "Yellow", hex: "#facc15" },
  { id: "purple", label: "Purple", hex: "#a855f7" },
  { id: "peach",  label: "Peach",  hex: "#fb923c" },
] as const;

export type FlowerColorId = (typeof FLOWER_COLORS)[number]["id"];

interface FlowerCardProps {
  flower: Flower;
  isSelected: boolean;
  selectedCount: number;
  selectedColor: FlowerColorId | null;
  onToggle: (flower: Flower) => void;
  onColorChange: (flowerId: string, color: FlowerColorId) => void;
}

export function FlowerCard({
  flower,
  isSelected,
  selectedCount,
  selectedColor,
  onToggle,
  onColorChange,
}: FlowerCardProps) {
  const t = useTranslations("flowers");

  return (
    <div className="flex flex-col">
      {/* ── Card ── */}
      <div
        onClick={() => onToggle(flower)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onToggle(flower)}
        className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white dark:bg-stone-900 transition-all duration-300 hover:-translate-y-1 ${
          isSelected
            ? "shadow-lg shadow-rose-100 dark:shadow-rose-900/30 ring-2 ring-rose-400"
            : "shadow-md shadow-stone-100 dark:shadow-black/20 ring-1 ring-stone-200 dark:ring-stone-700 hover:shadow-lg hover:ring-rose-300"
        }`}
      >
        {/* Count badge */}
        {selectedCount > 0 && (
          <div className="absolute right-2.5 top-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white shadow-md">
            {selectedCount}
          </div>
        )}

        {/* Checkmark */}
        <div
          className={`absolute left-2.5 top-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 ${
            isSelected
              ? "bg-rose-500 opacity-100 scale-100"
              : "bg-white/80 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100"
          }`}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1.5 5l2.5 2.5 4.5-4.5" />
          </svg>
        </div>

        {/* Selected colour dot */}
        {isSelected && selectedColor && (
          <div
            className="absolute bottom-10 right-2.5 z-10 h-4 w-4 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: FLOWER_COLORS.find((c) => c.id === selectedColor)?.hex }}
          />
        )}

        {/* Image */}
        <div className="h-44 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
          <Image
            src={flower.imagePath}
            alt={t(flower.altKey)}
            width={400}
            height={176}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${isSelected ? "brightness-95" : ""}`}
          />
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-0.5 px-3 py-2.5">
          <span className="text-sm font-semibold text-stone-800 dark:text-stone-100 leading-snug">
            {t(flower.nameKey)}
          </span>
          <span className="text-xs capitalize text-stone-400 dark:text-stone-500 tracking-wide">
            {flower.category}
          </span>
        </div>

        {/* Bottom bar */}
        <div className={`h-0.5 w-full transition-all duration-300 ${isSelected ? "bg-rose-400" : "bg-transparent group-hover:bg-rose-200"}`} />
      </div>

      {/* ── Colour picker — slides open below when selected ── */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isSelected ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="rounded-xl bg-white dark:bg-stone-900 ring-1 ring-stone-200 dark:ring-stone-700 px-3 py-2.5 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-2">
            Colour
          </p>
          <div className="flex gap-2">
            {FLOWER_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onColorChange(flower.id, color.id);
                }}
                title={color.label}
                className={`h-6 w-6 rounded-full border-2 transition-transform duration-150 hover:scale-110 ${
                  selectedColor === color.id
                    ? "border-stone-800 dark:border-white scale-110"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
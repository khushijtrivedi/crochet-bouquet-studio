"use client";

import Image from "next/image";
import { useLocale } from "@/app/context/LocaleContext";
import type { Flower } from "@/type/flower";

export const FLOWER_COLORS = [
  { id: "red",    label: "Red",    hex: "#ef4444" },
  { id: "pink",   label: "Pink",   hex: "#f472b6" },
  { id: "white",  label: "White",  hex: "#f5f5f4", border: true },
  { id: "yellow", label: "Yellow", hex: "#facc15" },
  { id: "purple", label: "Purple", hex: "#a855f7" },
  { id: "peach",  label: "Peach",  hex: "#fb923c" },
] as const;

export type FlowerColorId = (typeof FLOWER_COLORS)[number]["id"];

interface FlowerCardProps {
  flower: Flower;
  isSelected: boolean;
  quantity: number;
  selectedColor: FlowerColorId | null;
  onToggle: (flower: Flower) => void;
  onQuantityChange: (flowerId: string, qty: number) => void;
  onColorChange: (flowerId: string, color: FlowerColorId) => void;
}

export function FlowerCard({ flower, isSelected, quantity, selectedColor, onToggle, onQuantityChange, onColorChange }: FlowerCardProps) {
  const { t } = useLocale();
  const tf = (key: string) => t(`flowers.${key}`);

  return (
    <div className="flex flex-col">
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
        <div className={`absolute left-2.5 top-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 ${isSelected ? "bg-rose-500 opacity-100 scale-100" : "bg-white/80 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100"}`}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1.5 5l2.5 2.5 4.5-4.5" />
          </svg>
        </div>

        {isSelected && selectedColor && (
          <div className="absolute bottom-10 right-2.5 z-10 h-4 w-4 rounded-full border-2 border-white shadow" style={{ backgroundColor: FLOWER_COLORS.find((c) => c.id === selectedColor)?.hex }} />
        )}

        <div className="h-44 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
          <Image
            src={flower.imagePath}
            alt={tf(flower.altKey)}
            width={400}
            height={176}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${isSelected ? "brightness-95" : ""}`}
          />
        </div>

        <div className="flex flex-1 flex-col gap-0.5 px-3 py-2.5">
          <span className="text-sm font-semibold text-stone-800 dark:text-stone-100 leading-snug">
            {tf(flower.nameKey)}
          </span>
          <span className="text-xs capitalize text-stone-400 dark:text-stone-500 tracking-wide">
            {flower.category}
          </span>
        </div>

        <div className={`h-0.5 w-full transition-all duration-300 ${isSelected ? "bg-rose-400" : "bg-transparent group-hover:bg-rose-200"}`} />
      </div>

      <div className={`overflow-hidden transition-all duration-300 ${isSelected ? "max-h-32 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}`}>
        <div className="rounded-xl bg-white dark:bg-stone-900 ring-1 ring-stone-200 dark:ring-stone-700 px-3 py-2.5 shadow-sm space-y-2.5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1.5">Colour</p>
            <div className="flex gap-2">
              {FLOWER_COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onColorChange(flower.id, color.id); }}
                  title={color.label}
                  className={`h-6 w-6 rounded-full transition-transform duration-150 hover:scale-110 ${"border" in color && color.border ? "border border-stone-300 dark:border-stone-600" : "border-2 border-transparent"} ${selectedColor === color.id ? "ring-2 ring-offset-1 ring-stone-700 dark:ring-white scale-110" : ""}`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1.5">Quantity</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={(e) => { e.stopPropagation(); onQuantityChange(flower.id, Math.max(1, quantity - 1)); }} className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors">−</button>
              <span className="w-5 text-center text-sm font-semibold text-stone-800 dark:text-stone-100">{quantity}</span>
              <button type="button" onClick={(e) => { e.stopPropagation(); onQuantityChange(flower.id, Math.min(99, quantity + 1)); }} className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
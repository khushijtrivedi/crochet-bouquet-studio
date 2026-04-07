"use client";

import Image from "next/image";
import { useLocale } from "@/app/context/LocaleContext";
import type { Flower } from "@/type/flower";
import type { BouquetInstance } from "@/app/page";

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
  instances: BouquetInstance[];   // all colour variants currently in the bouquet
  isSelected: boolean;
  onToggle: (flower: Flower) => void;
  onAddVariant: (flower: Flower) => void;
  onRemoveInstance: (instanceId: string) => void;
  onQuantityChange: (instanceId: string, qty: number) => void;
  onColorChange: (instanceId: string, color: FlowerColorId) => void;
}

export function FlowerCard({
  flower,
  instances,
  isSelected,
  onToggle,
  onAddVariant,
  onRemoveInstance,
  onQuantityChange,
  onColorChange,
}: FlowerCardProps) {
  const { t } = useLocale();
  const tf = (key: string) => t(`flowers.${key}`);

  // Dots shown on the card image (up to 4 colors)
  const colorDots = instances
    .filter((i) => i.color !== null)
    .slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* ── Card image / title ── */}
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
        {/* Checkmark */}
        <div className={`absolute left-2.5 top-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 ${isSelected ? "bg-rose-500 opacity-100 scale-100" : "bg-white/80 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100"}`}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1.5 5l2.5 2.5 4.5-4.5" />
          </svg>
        </div>

        {/* Colour dots — bottom-right of image */}
        {colorDots.length > 0 && (
          <div className="absolute bottom-10 right-2 z-10 flex gap-1">
            {colorDots.map((inst) => {
              const c = FLOWER_COLORS.find((x) => x.id === inst.color);
              return c ? (
                <span
                  key={inst.instanceId}
                  className="h-3.5 w-3.5 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: c.hex }}
                />
              ) : null;
            })}
          </div>
        )}

        {/* Image */}
        <div className="relative h-44 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
          <Image
            src={flower.imagePath}
            alt={tf(flower.altKey)}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isSelected ? "brightness-95" : ""}`}
          />
        </div>

        {/* Name / category */}
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

      {/* ── Expanded controls (shown when selected) ── */}
      <div className={`overflow-hidden transition-all duration-300 ${isSelected ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}`}>
        <div className="rounded-xl bg-white dark:bg-stone-900 ring-1 ring-stone-200 dark:ring-stone-700 px-3 py-2.5 shadow-sm space-y-3">

          {/* One row per colour variant */}
          {instances.map((inst, idx) => (
            <div key={inst.instanceId} className="space-y-2">
              {/* Variant header */}
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">
                  {instances.length > 1
  ? t("flowerCard.variant").replace("{number}", String(idx + 1))
  : t("flowerCard.colour")}
                </p>
                {/* Remove this variant (only if more than one) */}
                {instances.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onRemoveInstance(inst.instanceId); }}
                    className="text-[10px] text-rose-400 hover:text-rose-600 transition-colors"
                  >
                   {t("flowerCard.remove")}
                  </button>
                )}
              </div>

              {/* Colour swatches */}
              <div className="flex gap-2">
                {FLOWER_COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onColorChange(inst.instanceId, color.id); }}
                    title={color.label}
                    className={`h-6 w-6 rounded-full transition-transform duration-150 hover:scale-110 ${"border" in color && color.border ? "border border-stone-300 dark:border-stone-600" : "border-2 border-transparent"} ${inst.color === color.id ? "ring-2 ring-offset-1 ring-stone-700 dark:ring-white scale-110" : ""}`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>

              {/* Quantity */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1">{t("flowerCard.quantity")}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onQuantityChange(inst.instanceId, Math.max(1, inst.quantity - 1)); }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                  >−</button>
                  <span className="w-5 text-center text-sm font-semibold text-stone-800 dark:text-stone-100">{inst.quantity}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onQuantityChange(inst.instanceId, Math.min(99, inst.quantity + 1)); }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                  >+</button>
                </div>
              </div>

              {/* Divider between variants */}
              {idx < instances.length - 1 && (
                <div className="border-t border-stone-100 dark:border-stone-800 pt-1" />
              )}
            </div>
          ))}

          {/* Add another colour variant */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onAddVariant(flower); }}
            className="w-full rounded-lg border border-dashed border-rose-200 dark:border-rose-900 py-1.5 text-[11px] font-semibold text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
           {t("flowerCard.add_variant")}
          </button>
        </div>
      </div>
    </div>
  );
}
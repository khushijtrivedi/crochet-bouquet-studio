"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { FLOWERS, getFlowersByCategory } from "@/data/flowers";
import type { Flower, FlowerCategory } from "@/type/flower";
import { FlowerCard, FLOWER_COLORS, type FlowerColorId } from "@/components/FlowerCard";

const CATEGORIES: { value: "all" | FlowerCategory; labelKey: string }[] = [
  { value: "all",     labelKey: "categories.all"     },
  { value: "classic", labelKey: "categories.classic" },
  { value: "garden",  labelKey: "categories.garden"  },
  { value: "exotic",  labelKey: "categories.exotic"  },
  { value: "wild",    labelKey: "categories.wild"    },
];

interface BouquetItem {
  flower: Flower;
  color: FlowerColorId | null;
}

export default function BouquetBuilderPage() {
  const t  = useTranslations("bouquet-builder");
  const tf = useTranslations("flowers");

  const [bouquet, setBouquet] = useState<BouquetItem[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | FlowerCategory>("all");
  const [dark, setDark] = useState(false);

  const visibleFlowers = activeTab === "all" ? FLOWERS : getFlowersByCategory(activeTab);

  const countFor = (id: string) => bouquet.filter((b) => b.flower.id === id).length;
  const isSelected = (id: string) => countFor(id) > 0;
  const colorFor = (id: string): FlowerColorId | null =>
    bouquet.find((b) => b.flower.id === id)?.color ?? null;

  const handleToggle = useCallback((flower: Flower) => {
    setBouquet((prev) => {
      const idx = prev.findLastIndex((b) => b.flower.id === flower.id);
      if (idx === -1) return [...prev, { flower, color: null }];
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  }, []);

  const handleColorChange = useCallback((flowerId: string, color: FlowerColorId) => {
    setBouquet((prev) =>
      prev.map((b) => (b.flower.id === flowerId ? { ...b, color } : b))
    );
  }, []);

  const uniqueInBouquet = Array.from(
    new Map(bouquet.map((b) => [b.flower.id, b])).values()
  );

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">

        {/* ── Header ── */}
        <header className="bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800 px-6 py-12 text-center relative">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDark((d) => !d)}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400 mb-2">
            {t("studio")}
          </p>
          <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-50 tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-stone-500 dark:text-stone-400 text-base max-w-md mx-auto">
            {t("subtitle")}
          </p>
        </header>

        {/* ── Sticky bouquet bar ── */}
        {bouquet.length > 0 && (
          <div className="sticky top-0 z-20 bg-rose-50 dark:bg-rose-950/60 border-b border-rose-100 dark:border-rose-900 px-6 py-3 shadow-sm backdrop-blur-sm">
            <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-rose-700 dark:text-rose-400">
                  🌸 {t("summary", { count: bouquet.length })}
                </span>
                {uniqueInBouquet.map(({ flower, color }) => {
                  const count = countFor(flower.id);
                  const colorHex = color ? FLOWER_COLORS.find((c) => c.id === color)?.hex : null;
                  return (
                    <span
                      key={flower.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-stone-800 px-3 py-0.5 text-xs font-medium text-stone-700 dark:text-stone-300 ring-1 ring-stone-200 dark:ring-stone-700 shadow-sm"
                    >
                      {colorHex && (
                        <span className="h-2.5 w-2.5 rounded-full border border-stone-200 dark:border-stone-600" style={{ backgroundColor: colorHex }} />
                      )}
                      {tf(flower.nameKey)}
                      {count > 1 && (
                        <span className="rounded-full bg-rose-400 px-1.5 py-px text-[10px] font-bold text-white">
                          ×{count}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
              <button
                onClick={() => setBouquet([])}
                className="rounded-full border border-rose-200 dark:border-rose-800 bg-white dark:bg-stone-900 px-4 py-1 text-xs font-medium text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
              >
                {t("clearAll")}
              </button>
            </div>
          </div>
        )}

        {/* ── Main ── */}
        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">

          {/* Category tabs */}
          <div className="mb-8 flex flex-wrap gap-2">
            {CATEGORIES.map(({ value, labelKey }) => (
              <button
                key={value}
                onClick={() => setActiveTab(value)}
                className={
                  activeTab === value
                    ? "rounded-full bg-rose-500 px-5 py-1.5 text-sm font-semibold text-white shadow-sm"
                    : "rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-5 py-1.5 text-sm font-medium text-stone-500 dark:text-stone-400 hover:border-rose-300 hover:text-rose-500 transition-colors"
                }
              >
                {t(labelKey)}
              </button>
            ))}
          </div>

          {/* Flower grid */}
          {visibleFlowers.length === 0 ? (
            <p className="py-24 text-center text-stone-400 text-sm">{t("empty")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {visibleFlowers.map((flower) => (
                <FlowerCard
                  key={flower.id}
                  flower={flower}
                  isSelected={isSelected(flower.id)}
                  selectedCount={countFor(flower.id)}
                  selectedColor={colorFor(flower.id)}
                  onToggle={handleToggle}
                  onColorChange={handleColorChange}
                />
              ))}
            </div>
          )}

          {bouquet.length === 0 && (
            <p className="mt-10 text-center text-sm text-stone-400 dark:text-stone-600">
              {t("hint")}
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
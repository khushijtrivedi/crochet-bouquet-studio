"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { FLOWERS, getFlowersByCategory } from "@/data/flowers";
import type { Flower, FlowerCategory } from "@/type/flower";
import { FlowerCard } from "@/components/FlowerCard";

const CATEGORIES: { value: "all" | FlowerCategory; labelKey: string }[] = [
  { value: "all",     labelKey: "categories.all"     },
  { value: "classic", labelKey: "categories.classic" },
  { value: "garden",  labelKey: "categories.garden"  },
  { value: "exotic",  labelKey: "categories.exotic"  },
  { value: "wild",    labelKey: "categories.wild"    },
];

export default function BouquetBuilderPage() {
  const t  = useTranslations("bouquet-builder");
  const tf = useTranslations("flowers");

  const [bouquet, setBouquet] = useState<Flower[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | FlowerCategory>("all");

  const visibleFlowers = activeTab === "all" ? FLOWERS : getFlowersByCategory(activeTab);
  const countFor = (id: string) => bouquet.filter((f) => f.id === id).length;
  const isSelected = (id: string) => countFor(id) > 0;

  const handleToggle = useCallback((flower: Flower) => {
    setBouquet((prev) => {
      const idx = prev.findLastIndex((f) => f.id === flower.id);
      if (idx === -1) return [...prev, flower];
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  }, []);

  const uniqueInBouquet = Array.from(new Map(bouquet.map((f) => [f.id, f])).values());

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">

      {/* Header */}
      <header className="border-b border-stone-200 bg-white px-6 py-10 text-center shadow-sm">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-rose-400">
          {t("studio")}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-base text-stone-500">{t("subtitle")}</p>
      </header>

      {/* Sticky bouquet summary */}
      {bouquet.length > 0 && (
        <div className="sticky top-0 z-20 border-b border-rose-100 bg-rose-50 px-6 py-3 shadow-sm">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-rose-700">
                🌸 {t("summary", { count: bouquet.length })}
              </span>
              {uniqueInBouquet.map((f) => {
                const count = countFor(f.id);
                return (
                  <span key={f.id} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-0.5 text-xs font-medium text-stone-700 shadow-sm ring-1 ring-stone-200">
                    {tf(f.nameKey)}
                    {count > 1 && (
                      <span className="ml-0.5 rounded-full bg-rose-400 px-1.5 py-px text-[10px] font-bold text-white">
                        ×{count}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
            <button
              onClick={() => setBouquet([])}
              className="rounded-full border border-rose-300 bg-white px-4 py-1 text-xs font-medium text-rose-500 transition hover:bg-rose-100"
            >
              {t("clearAll")}
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">

        {/* Category tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map(({ value, labelKey }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={
                activeTab === value
                  ? "rounded-full bg-rose-500 px-5 py-1.5 text-sm font-semibold text-white shadow"
                  : "rounded-full border border-stone-300 bg-white px-5 py-1.5 text-sm font-medium text-stone-600 transition hover:border-rose-300 hover:text-rose-500"
              }
            >
              {t(labelKey)}
            </button>
          ))}
        </div>

        {/* Grid */}
        {visibleFlowers.length === 0 ? (
          <p className="py-20 text-center text-stone-400">{t("empty")}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visibleFlowers.map((flower) => (
              <FlowerCard
                key={flower.id}
                flower={flower}
                isSelected={isSelected(flower.id)}
                selectedCount={countFor(flower.id)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}

        {bouquet.length === 0 && (
          <p className="mt-10 text-center text-sm text-stone-400">{t("hint")}</p>
        )}
      </main>
    </div>
  );
}
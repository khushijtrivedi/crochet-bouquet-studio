"use client";

import { useState, useCallback, useEffect } from "react";
import { useLocale } from "./context/LocaleContext";
import { FLOWERS, getFlowersByCategory } from "@/data/flowers";
import type { Flower, FlowerCategory } from "@/type/flower";
import { FlowerCard, FLOWER_COLORS, type FlowerColorId } from "@/components/FlowerCard";
import { SakuraBackground } from "@/components/SakuraBackground";
import { generateBouquet } from "@/lib/bouquetApi";

const CATEGORIES: { value: "all" | FlowerCategory; key: string }[] = [
  { value: "all",     key: "categories.all"     },
  { value: "classic", key: "categories.classic" },
  { value: "garden",  key: "categories.garden"  },
  { value: "exotic",  key: "categories.exotic"  },
  { value: "wild",    key: "categories.wild"    },
];

// Each "instance" is one flower + one color combination.
// A single flower can have multiple instances (e.g. 1 red rose + 1 pink rose).
export interface BouquetInstance {
  instanceId: string;
  flower: Flower;
  color: FlowerColorId | null;
  quantity: number;
}

let _counter = 0;
const makeInstanceId = (flowerId: string) => `${flowerId}-${++_counter}`;

export default function BouquetBuilderPage() {
  const { t, switchLocale } = useLocale();

  const tb = (key: string, params?: Record<string, string | number>) =>
    t(`bouquet-builder.${key}`, params);
  const tf = (key: string) => t(`flowers.${key}`);
  const tl = (key: string) => t(`language.${key}`);

  const [bouquet, setBouquet]                   = useState<BouquetInstance[]>([]);
  const [activeTab, setActiveTab]               = useState<"all" | FlowerCategory>("all");
  const [dark, setDark]                         = useState(false);
  const [generating, setGenerating]             = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<string | null>(null);
  const [generateError, setGenerateError]       = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const visibleFlowers  = activeTab === "all" ? FLOWERS : getFlowersByCategory(activeTab);
  const instancesFor    = (id: string) => bouquet.filter((b) => b.flower.id === id);
  const isSelected      = (id: string) => bouquet.some((b) => b.flower.id === id);

  // Click card → add first instance. Click again (when selected) → remove ALL instances.
  const handleToggle = useCallback((flower: Flower) => {
    setBouquet((prev) => {
      const has = prev.some((b) => b.flower.id === flower.id);
      if (has) return prev.filter((b) => b.flower.id !== flower.id);
      return [...prev, { instanceId: makeInstanceId(flower.id), flower, color: null, quantity: 1 }];
    });
  }, []);

  // "＋ Add colour" button inside the card
  const handleAddVariant = useCallback((flower: Flower) => {
    setBouquet((prev) => [
      ...prev,
      { instanceId: makeInstanceId(flower.id), flower, color: null, quantity: 1 },
    ]);
  }, []);

  // Remove one specific colour variant
  const handleRemoveInstance = useCallback((instanceId: string) => {
    setBouquet((prev) => {
      const next = prev.filter((b) => b.instanceId !== instanceId);
      return next;
    });
  }, []);

  const handleQuantityChange = useCallback((instanceId: string, qty: number) => {
    setBouquet((prev) =>
      prev.map((b) => (b.instanceId === instanceId ? { ...b, quantity: qty } : b))
    );
  }, []);

  const handleColorChange = useCallback((instanceId: string, color: FlowerColorId) => {
    setBouquet((prev) =>
      prev.map((b) => (b.instanceId === instanceId ? { ...b, color } : b))
    );
  }, []);

  const handleGenerateBouquet = async () => {
    if (bouquet.length === 0) return;
    setGenerating(true);
    setGeneratedPreview(null);
    setGenerateError(null);
    try {
      const result = await generateBouquet(
        bouquet.map((item) => ({
          id: item.flower.id,
          color: item.color,
          quantity: item.quantity,
        }))
      );
      setGeneratedPreview(result);
    } catch {
      setGenerateError(tb("notepad.error"));
    } finally {
      setGenerating(false);
    }
  };

  const handleClearAll = () => {
    setBouquet([]);
    setGeneratedPreview(null);
    setGenerateError(null);
  };

  const totalItems = bouquet.reduce((sum, b) => sum + b.quantity, 0);
  const stemsLabel = totalItems === 1
    ? tb("notepad.stems_one",  { count: totalItems })
    : tb("notepad.stems_other", { count: totalItems });

  return (
    <div className="relative min-h-screen">
      <SakuraBackground dark={dark} />

      <div className="relative z-10">
        <header className="px-6 py-12 text-center relative">
          <div className="absolute right-6 top-6 flex items-center gap-2">
            <button
              onClick={switchLocale}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm bg-white/30 dark:bg-white/10 border border-white/40 dark:border-white/20 text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/20 transition-all"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              {tl("switch")}
            </button>
            <button
              onClick={() => setDark((d) => !d)}
              className="flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm bg-white/30 dark:bg-white/10 border border-white/40 dark:border-white/20 text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/20 transition-all"
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose-500 dark:text-rose-400 mb-2">
            {tb("studio")}
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-slate-800 dark:text-white sm:text-6xl">
            {tb("title")}
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-300 text-base max-w-md mx-auto leading-relaxed">
            {tb("subtitle")}
          </p>
        </header>

        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="mb-8 flex flex-wrap gap-2">
            {CATEGORIES.map(({ value, key }) => (
              <button
                key={value}
                onClick={() => setActiveTab(value)}
                className={
                  activeTab === value
                    ? "rounded-full bg-rose-500 px-5 py-1.5 text-sm font-semibold text-white shadow-sm"
                    : "rounded-full backdrop-blur-sm bg-white/50 dark:bg-white/10 border border-white/60 dark:border-white/20 px-5 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-white/20 transition-all"
                }
              >
                {tb(key)}
              </button>
            ))}
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-1 min-w-0">
              {visibleFlowers.length === 0 ? (
                <p className="py-24 text-center text-slate-400 text-sm">{tb("empty")}</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {visibleFlowers.map((flower) => (
                    <FlowerCard
                      key={flower.id}
                      flower={flower}
                      instances={instancesFor(flower.id)}
                      isSelected={isSelected(flower.id)}
                      onToggle={handleToggle}
                      onAddVariant={handleAddVariant}
                      onRemoveInstance={handleRemoveInstance}
                      onQuantityChange={handleQuantityChange}
                      onColorChange={handleColorChange}
                    />
                  ))}
                </div>
              )}
              {bouquet.length === 0 && (
                <p className="mt-10 text-center text-sm text-slate-400 dark:text-slate-500">
                  {tb("hint")}
                </p>
              )}
            </div>

            {/* ── Notepad sidebar ── */}
            <div className="w-72 shrink-0 sticky top-6">
              <div
                className="relative overflow-hidden rounded-2xl shadow-xl"
                style={{
                  backgroundImage: dark
                    ? `repeating-linear-gradient(transparent, transparent 31px, rgba(147,197,253,0.08) 31px, rgba(147,197,253,0.08) 32px),
                       linear-gradient(90deg, transparent 44px, rgba(252,165,165,0.12) 44px, rgba(252,165,165,0.12) 45px, transparent 45px)`
                    : `repeating-linear-gradient(transparent, transparent 31px, rgba(147,197,253,0.28) 31px, rgba(147,197,253,0.28) 32px),
                       linear-gradient(90deg, transparent 44px, rgba(252,165,165,0.4) 44px, rgba(252,165,165,0.4) 45px, transparent 45px)`,
                  backgroundSize: "100% 32px, 100% 100%",
                  backgroundColor: dark ? "rgb(15 23 42)" : "rgb(255 253 244)",
                  border: dark ? "1px solid rgba(147,197,253,0.18)" : "1px solid rgba(203,213,225,0.7)",
                  minHeight: "400px",
                }}
              >
                <div className="absolute top-0 bottom-0 w-px" style={{ left: "44px", background: dark ? "rgba(248,113,113,0.28)" : "rgba(248,113,113,0.5)" }} />

                <div className="relative z-10 pl-14 pr-5 pt-7 pb-7">
                  <p className="text-base font-bold mb-0.5 leading-snug" style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: dark ? "rgb(255 255 255)" : "rgb(15 23 42)" }}>
                    {tb("notepad.title")}
                  </p>
                  <p className="text-[11px] tracking-wide mb-4" style={{ color: dark ? "rgb(148 163 184)" : "rgb(100 116 139)" }}>
                    {totalItems === 0 ? tb("notepad.empty") : stemsLabel}
                  </p>

                  <div className="border-t mb-4" style={{ borderColor: dark ? "rgba(147,197,253,0.15)" : "rgba(203,213,225,0.7)" }} />

                  {bouquet.length === 0 ? (
                    <p className="text-sm italic leading-relaxed" style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: dark ? "rgb(71 85 105)" : "rgb(148 163 184)" }}>
                      {tb("notepad.placeholder")}
                    </p>
                  ) : (
                    <div>
                      {bouquet.map((item) => {
                        const colorObj = FLOWER_COLORS.find((c) => c.id === item.color);
                        return (
                          <div key={item.instanceId} className="flex items-start gap-2.5 py-[6px]">
                            {colorObj ? (
                              <span className="mt-[5px] h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-white/40" style={{ backgroundColor: colorObj.hex }} />
                            ) : (
                              <span className="mt-[5px] h-2.5 w-2.5 shrink-0 rounded-full border border-dashed" style={{ borderColor: dark ? "rgb(71 85 105)" : "rgb(203 213 225)" }} />
                            )}
                            <span className="text-sm leading-snug" style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: dark ? "rgb(226 232 240)" : "rgb(15 23 42)" }}>
                              {item.quantity}× {tf(`${item.flower.nameKey}`)}
                              {colorObj && (
                                <span className="block text-[11px] mt-0.5" style={{ color: dark ? "rgb(100 116 139)" : "rgb(148 163 184)" }}>
                                  {colorObj.label}
                                </span>
                              )}
                            </span>
                          </div>
                        );
                      })}

                      <div className="mt-5 space-y-2">
                        <button
                          onClick={handleGenerateBouquet}
                          disabled={generating}
                          className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60"
                          style={{ background: generating ? "rgb(148 163 184)" : "linear-gradient(135deg, #f43f8a, #ec4899, #a855f7)" }}
                        >
                          {generating ? tb("notepad.generating") : tb("notepad.preview_button")}
                        </button>
                        <button
                          onClick={handleClearAll}
                          className="w-full text-[11px] underline underline-offset-2 transition-colors"
                          style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: dark ? "rgb(248 113 113)" : "rgb(251 113 133)" }}
                        >
                          {tb("notepad.clear")}
                        </button>
                      </div>
                    </div>
                  )}

                  {generateError && (
                    <p className="mt-3 text-xs" style={{ color: dark ? "rgb(248 113 113)" : "rgb(239 68 68)" }}>
                      {generateError}
                    </p>
                  )}

                  {generatedPreview && (
                    <div className="mt-5">
                      <div className="border-t mb-3" style={{ borderColor: dark ? "rgba(147,197,253,0.15)" : "rgba(203,213,225,0.7)" }} />
                      <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: dark ? "rgb(100 116 139)" : "rgb(148 163 184)" }}>
                        {tb("notepad.ai_preview_label")}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: dark ? "rgb(226 232 240)" : "rgb(15 23 42)" }}>
                        {generatedPreview}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
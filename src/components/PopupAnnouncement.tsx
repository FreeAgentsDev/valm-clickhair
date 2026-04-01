"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { PopupConfig } from "@/types";

const DEFAULT_POPUP: PopupConfig = {
  enabled: false,
  title: "¡Bienvenido!",
  content: "Descubre nuestras ofertas en belleza y cuidado capilar.",
  ctaText: "Ver productos",
  ctaUrl: "/",
};

const DISMISSED_KEY = "popup_dismissed_session";

export default function PopupAnnouncement() {
  const [config, setConfig] = useState<PopupConfig>(DEFAULT_POPUP);
  const [visible, setVisible] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    fetch("/api/admin/popup")
      .then((res) => res.json())
      .then((data) => {
        const cfg = data.config || DEFAULT_POPUP;
        setConfig(cfg);
        if (cfg.enabled && !sessionStorage.getItem(DISMISSED_KEY)) {
          setVisible(true);
        }
      })
      .catch(() => {});
  }, []);

  const allImages = config.images?.length
    ? config.images
    : config.image
      ? [config.image]
      : [];

  const isDark =
    config.bgColor === "#111111" || config.bgColor === "#E93B3C";

  const handleClose = useCallback(() => {
    setVisible(false);
    sessionStorage.setItem(DISMISSED_KEY, "1");
  }, []);

  if (!visible || !config.enabled) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      <button
        type="button"
        onClick={handleClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Cerrar anuncio"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-slide-up">
        {/* Close */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 rounded-full p-2 text-white/80 bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/50"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        {/* Images */}
        {allImages.length > 0 && (
          <div className="relative h-48 w-full bg-gray-100 sm:h-56">
            <Image
              src={allImages[imgIdx]}
              alt={config.title || "Anuncio"}
              fill
              className="object-cover"
              sizes="(max-width: 448px) 100vw, 448px"
            />
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setImgIdx(
                      (imgIdx - 1 + allImages.length) % allImages.length
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setImgIdx((imgIdx + 1) % allImages.length)
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60"
                >
                  <ChevronRight size={16} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImgIdx(i)}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        i === imgIdx ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div
          className="p-6"
          style={{ backgroundColor: config.bgColor || "#ffffff" }}
        >
          {config.badge && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold mb-3 ${
                isDark
                  ? "bg-white/20 text-white"
                  : "bg-[#E93B3C]/10 text-[#E93B3C]"
              }`}
            >
              <Sparkles size={12} /> {config.badge}
            </span>
          )}
          {config.title && (
            <h2
              id="popup-title"
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {config.title}
            </h2>
          )}
          {config.subtitle && (
            <p
              className={`text-sm font-medium mt-1 ${
                isDark ? "text-white/80" : "text-[#E93B3C]"
              }`}
            >
              {config.subtitle}
            </p>
          )}
          {config.content && (
            <p
              className={`mt-2 text-sm ${
                isDark ? "text-white/70" : "text-gray-600"
              }`}
            >
              {config.content}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            {config.ctaText && config.ctaUrl && (
              <a
                href={config.ctaUrl}
                onClick={handleClose}
                className={`inline-block rounded-full px-6 py-3 text-sm font-bold transition-all hover:opacity-90 ${
                  isDark
                    ? "bg-white text-gray-900"
                    : "bg-[#E93B3C] text-white"
                }`}
              >
                {config.ctaText}
              </a>
            )}
            {config.cta2Text && config.cta2Url && (
              <a
                href={config.cta2Url}
                onClick={handleClose}
                className={`inline-block rounded-full px-6 py-3 text-sm font-bold border-2 transition-all hover:opacity-90 ${
                  isDark
                    ? "border-white/40 text-white"
                    : "border-[#E93B3C]/30 text-[#E93B3C]"
                }`}
              >
                {config.cta2Text}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

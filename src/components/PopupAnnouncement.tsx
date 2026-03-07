"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { storageService } from "@/lib/storage";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const cfg = storageService.getPopup(DEFAULT_POPUP);
    setConfig(cfg);
    if (cfg.enabled && !sessionStorage.getItem(DISMISSED_KEY)) {
      setVisible(true);
    }
  }, [mounted]);

  useEffect(() => {
    const handler = () => {
      const cfg = storageService.getPopup(DEFAULT_POPUP);
      setConfig(cfg);
      if (!cfg.enabled) setVisible(false);
    };
    window.addEventListener("storage-update", handler);
    return () => window.removeEventListener("storage-update", handler);
  }, []);

  const handleClose = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISSED_KEY, "1");
  };

  if (!visible || !config.enabled) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      {/* Overlay */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Cerrar anuncio"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        {config.image && (
          <div className="relative h-40 w-full bg-gray-100 sm:h-48">
            <Image
              src={config.image}
              alt={config.title || "Anuncio"}
              fill
              className="object-cover"
              unoptimized={config.image.startsWith("data:")}
              sizes="(max-width: 448px) 100vw, 448px"
            />
          </div>
        )}

        <div className="p-6">
          {config.title && (
            <h2
              id="popup-title"
              className="mb-2 text-xl font-bold text-gray-900"
            >
              {config.title}
            </h2>
          )}
          {config.content && (
            <p className="mb-6 text-gray-600">{config.content}</p>
          )}
          {config.ctaText && config.ctaUrl && (
            <a
              href={config.ctaUrl}
              onClick={handleClose}
              className="inline-block rounded-lg px-6 py-3 text-sm font-bold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: "#D62839" }}
            >
              {config.ctaText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

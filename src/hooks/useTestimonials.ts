"use client";

import { useState, useEffect, useCallback } from "react";
import type { Testimonial } from "@/lib/admin-storage";

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { name: "Carolina M.", text: "Los perfumes capilares son increibles, mi cabello huele espectacular todo el dia. Amo la variedad que tienen.", label: "Clienta verificada", stars: 5 },
  { name: "Valentina R.", text: "Los exfoliantes Walaky son buenisimos. La atencion por WhatsApp fue super rapida y me asesoraron perfecto.", label: "Clienta verificada", stars: 5 },
  { name: "Laura G.", text: "La mantequilla con glitter es un descubrimiento! Piel suave, brillante y el aroma dura horas.", label: "Clienta verificada", stars: 5 },
];

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (data.testimonials && data.testimonials.length > 0) {
        setTestimonials(data.testimonials);
      }
    } catch {
      // keep defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateTestimonials = useCallback(async (next: Testimonial[]) => {
    setTestimonials(next);
    try {
      await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonials: next }),
      });
    } catch (err) {
      console.error("Error guardando testimonios:", err);
    }
  }, []);

  return { testimonials, loading, updateTestimonials, refresh };
}

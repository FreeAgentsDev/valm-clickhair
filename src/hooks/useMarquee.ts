"use client";

import { useState, useEffect, useCallback } from "react";

const DEFAULT_MESSAGES = [
  "Envíos a todo Colombia",
  "Pago seguro con Mercado Pago y ADDI",
  "Productos 100% originales",
  "Compra fácil y rápido",
  "Marcas certificadas",
];

export function useMarquee() {
  const [messages, setMessages] = useState<string[]>(DEFAULT_MESSAGES);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/marquee");
      const data = await res.json();
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages);
      } else {
        setMessages(DEFAULT_MESSAGES);
      }
    } catch {
      setMessages(DEFAULT_MESSAGES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateMessages = useCallback(async (next: string[]) => {
    const filtered = next.filter((m) => m.trim());
    setMessages(filtered);
    try {
      await fetch("/api/admin/marquee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: filtered }),
      });
    } catch (err) {
      console.error("Error guardando marquee:", err);
    }
  }, []);

  return { messages, loading, updateMessages, refresh };
}

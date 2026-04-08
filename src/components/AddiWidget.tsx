"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface AddiWidgetProps {
  price: number;
}

/**
 * Widget de ADDI que muestra las cuotas disponibles en la página de producto.
 * Se renderiza usando el web component <addi-widget> de ADDI.
 */
export default function AddiWidget({ price }: AddiWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const allySlug = "clickhairmanizales-ecommerce";

  useEffect(() => {
    // Forzar re-render del widget cuando cambia el precio
    if (containerRef.current) {
      const existing = containerRef.current.querySelector("addi-widget");
      if (existing) {
        existing.setAttribute("price", String(Math.round(price)));
      }
    }
  }, [price]);

  if (price <= 0) return null;

  return (
    <>
      <Script
        src="https://s3.amazonaws.com/widgets.addi.com/bundle.min.js"
        strategy="lazyOnload"
      />
      <div ref={containerRef} className="mt-3">
        {/* @ts-expect-error addi-widget is a custom web component */}
        <addi-widget
          price={String(Math.round(price))}
          ally-slug={allySlug}
        />
      </div>
    </>
  );
}

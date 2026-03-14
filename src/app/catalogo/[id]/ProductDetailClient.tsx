"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductDetailClientProps {
  images: string[];
  name: string;
}

export default function ProductDetailClient({ images, name }: ProductDetailClientProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImage = images[selectedIndex] || "/logos/valmlogo.png";

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#FDF2F4] border-2 border-[#F6BCCB]/30">
        <Image
          src={mainImage}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                i === selectedIndex
                  ? "border-[#E93B3C] ring-2 ring-[#E93B3C]/20 shadow-md"
                  : "border-[#F6BCCB]/40 hover:border-[#E93B3C]/40"
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

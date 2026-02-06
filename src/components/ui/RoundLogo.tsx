"use client";

import Image from "next/image";

interface RoundLogoProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  ring?: boolean;
}

export function RoundLogo({
  src,
  alt,
  size = 48,
  className = "",
  ring = true,
}: RoundLogoProps) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-white shadow-md ${ring ? "ring-2 ring-gray-100" : ""} ${className}`}
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes={`${size}px`} />
    </div>
  );
}

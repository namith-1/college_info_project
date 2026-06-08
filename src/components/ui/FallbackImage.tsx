"use client";

import { useState } from "react";

export const COLLEGE_IMAGE_FALLBACK =
  "/images/college-fallback.svg";

export function FallbackImage({
  src,
  fallbackSrc = COLLEGE_IMAGE_FALLBACK,
  alt,
  className
}: {
  src?: string | null;
  fallbackSrc?: string;
  alt: string;
  className?: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  return (
    <img
      className={className}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}

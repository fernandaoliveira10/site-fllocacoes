"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import type { CarouselSlide } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: CarouselSlide[];
  className?: string;
  imageClassName?: string;
  autoPlayMs?: number;
  emptyState?: ReactNode;
  mediaFit?: "cover" | "contain";
}

const VIDEO_PATTERN = /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i;

function isVideoSlide(slide: CarouselSlide) {
  return slide.type === "VIDEO" || VIDEO_PATTERN.test(slide.src);
}

export function ImageCarousel({
  images,
  className,
  imageClassName,
  autoPlayMs = 4800,
  emptyState,
  mediaFit = "cover",
}: ImageCarouselProps) {
  const normalizedImages = images.filter((image) => Boolean(image?.src));
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = normalizedImages.length > 1;
  const signature = normalizedImages.map((image) => `${image.src}|${image.alt}|${image.type ?? "IMAGE"}`).join("::");
  const fitClassName = mediaFit === "contain" ? "object-contain bg-fl-gray-50" : "object-cover";

  useEffect(() => {
    setActiveIndex(0);
  }, [signature]);

  useEffect(() => {
    if (!hasMultiple) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % normalizedImages.length);
    }, autoPlayMs);

    return () => window.clearInterval(timer);
  }, [autoPlayMs, hasMultiple, normalizedImages.length]);

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % normalizedImages.length);
  };

  if (normalizedImages.length === 0) {
    return (
      emptyState ?? (
        <div
          className={cn(
            "flex min-h-[280px] items-center justify-center rounded-3xl border border-dashed border-fl-gray-300 bg-fl-gray-50 px-6 text-center",
            className,
          )}
        >
          <p className="max-w-sm text-sm leading-6 text-fl-gray-500">
            Espaço reservado para o banner. Adicione imagens ou vídeos depois para ativar o carrossel.
          </p>
        </div>
      )
    );
  }

  const currentSlide = normalizedImages[activeIndex];
  const videoSlide = isVideoSlide(currentSlide);

  return (
    <div className={cn("group relative overflow-hidden rounded-3xl border border-fl-gray-200 bg-fl-gray-100 shadow-soft", className)}>
      <div
  className={cn(
    "relative w-full",
    hasMultiple && "cursor-pointer",
    imageClassName ?? "aspect-[16/9]"
  )}
  onClick={hasMultiple ? goToNext : undefined}
>
        {videoSlide ? (
          <video
            key={currentSlide.src}
            className={cn("h-full w-full transition duration-700 ease-out group-hover:scale-[1.02]", fitClassName)}
            controls
            autoPlay
            muted
            loop
            playsInline
            poster={currentSlide.poster}
          >
            <source src={currentSlide.src} />
          </video>
        ) : (
          <Image
            src={currentSlide.src}
            alt={currentSlide.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className={cn("transition duration-700 ease-out group-hover:scale-[1.02]", fitClassName)}
            priority={activeIndex === 0}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
      </div>

      {hasMultiple && (
        <>
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
            {normalizedImages.map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex(index);
                }}
                aria-label={`Ir para a imagem ${index + 1}`}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  index === activeIndex ? "w-7 bg-white" : "w-2.5 bg-white/60 hover:bg-white/80",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

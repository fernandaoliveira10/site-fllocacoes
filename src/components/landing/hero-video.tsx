"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface HeroVideoProps {
  src: string;
  className?: string;
}

/**
 * Background hero video.
 *
 * Mobile browsers (iOS Safari, Chrome Android) only autoplay a video when it is
 * genuinely muted and inline. React does not always render the `muted` attribute
 * to the DOM, so we force `muted` on the element via a ref and re-trigger
 * `play()` after mount — otherwise the video stays frozen on phones even though
 * it plays on desktop.
 */
export function HeroVideo({ src, className }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const tryPlay = () => {
      const attempt = video.play();
      if (attempt) attempt.catch(() => undefined);
    };

    tryPlay();

    // Some mobile browsers only allow playback once the tab is visible or the
    // user has touched the screen once.
    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("touchstart", tryPlay, { once: true, passive: true });

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("touchstart", tryPlay);
    };
  }, []);

  return (
    <video
      ref={ref}
      className={cn("absolute inset-0 -z-10 h-full w-full object-cover opacity-70", className)}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    >
      <source src={src} />
    </video>
  );
}

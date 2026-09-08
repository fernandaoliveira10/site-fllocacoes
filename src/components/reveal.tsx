"use client";

import { createElement, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type RevealTag = "div" | "article" | "li" | "figure" | "section" | "span" | "ul" | "ol";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger index — multiplies the entrance delay (capped). */
  index?: number;
  as?: RevealTag;
}

/**
 * Scroll-reveal wrapper built on IntersectionObserver + CSS transitions.
 *
 * It is deliberately resilient: content becomes visible when it scrolls into
 * view, when IntersectionObserver is unavailable, when the user prefers reduced
 * motion, or after a short safety timeout — so a slow or broken observer can
 * never leave marketing content hidden.
 */
export function Reveal({ children, className, index = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);

    // Safety net: never keep content hidden for longer than this.
    const timeout = window.setTimeout(() => setVisible(true), 1600);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, []);

  return createElement(
    as,
    {
      ref,
      className: cn("fl-reveal", visible && "is-visible", className),
      style: { transitionDelay: `${Math.min(index * 60, 300)}ms` },
    },
    children,
  );
}

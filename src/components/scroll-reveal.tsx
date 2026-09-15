"use client";

import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

type RevealElement = "div" | "section" | "article" | "aside" | "header" | "footer" | "ul" | "ol";

type ScrollRevealProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  as?: RevealElement;
  children: ReactNode;
  delay?: number;
  stagger?: boolean;
};

type RevealStyle = CSSProperties & {
  "--reveal-delay": string;
};

const useClientLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function ScrollReveal({
  as = "div",
  children,
  delay = 0,
  stagger = false,
  style,
  ...props
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLElement>(null);

  useClientLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    element.dataset.revealReady = "true";

    const revealImmediately = () => {
      element.dataset.revealVisible = "true";
    };

    // Do not hide content that was already visible before hydration.
    const rect = element.getBoundingClientRect();
    if (motionPreference.matches || !("IntersectionObserver" in window) ||
        (rect.top < window.innerHeight && rect.bottom > 0)) {
      revealImmediately();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        revealImmediately();
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.16 },
    );

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      revealImmediately();
      observer.disconnect();
    };

    // Keyboard navigation must not land on an invisible link.
    const handleFocus = () => {
      revealImmediately();
      observer.disconnect();
    };
    element.addEventListener("focusin", handleFocus);
    motionPreference.addEventListener("change", handleMotionPreference);
    observer.observe(element);

    return () => {
      element.removeEventListener("focusin", handleFocus);
      motionPreference.removeEventListener("change", handleMotionPreference);
      observer.disconnect();
    };
  }, []);

  const revealStyle: RevealStyle = {
    ...style,
    "--reveal-delay": `${Math.max(0, delay)}ms`,
  };

  const Tag = as;
  return (
    <Tag
      {...props}
      data-scroll-reveal={stagger ? "stagger" : "single"}
      ref={(element: HTMLElement | null) => { elementRef.current = element; }}
      style={revealStyle}
    >
      {children}
    </Tag>
  );
}

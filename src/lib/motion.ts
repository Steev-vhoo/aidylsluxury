import type { CSSProperties } from "react";

/** Stagger helper for data-reveal elements: style={delay(i)} gives 0ms, 120ms, 240ms… */
export const delay = (i: number, step = 120) => ({ "--d": `${i * step}ms` }) as CSSProperties;

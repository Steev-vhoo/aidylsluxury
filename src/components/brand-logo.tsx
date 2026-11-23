import Image from "next/image";

type Tone = "ink" | "gold";

/** Horizontal lockup: AL monogram + AIDYL'S LUXURY wordmark. */
export function BrandLogo({ tone = "ink", height = 48, wordmark = true, className = "" }: { tone?: Tone; height?: number; wordmark?: boolean; className?: string }) {
  const markW = Math.round((449 / 396) * height);
  const wordH = Math.round(height * 0.26);
  const wordW = Math.round((472 / 39) * wordH);
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Image src={`/brand/logo-mark-${tone}.png`} alt="" width={markW} height={height} priority style={{ height, width: markW }} />
      {wordmark && <Image src={`/brand/logo-wordmark-${tone}.png`} alt="" width={wordW} height={wordH} priority style={{ height: wordH, width: wordW }} className="hidden sm:block" />}
      <span className="sr-only">Aidyl&apos;s Luxury</span>
    </span>
  );
}

/** Stacked full logo (monogram, wordmark and lotus). */
export function BrandLogoFull({ tone = "ink", width = 160, className = "" }: { tone?: Tone; width?: number; className?: string }) {
  const height = Math.round((498 / 476) * width);
  return <Image src={`/brand/logo-full-${tone}.png`} alt="Aidyl's Luxury" width={width} height={height} className={className} style={{ width, height }} />;
}

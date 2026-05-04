import Link from "next/link";

/**
 * Credit Speed Logo
 *
 * Source file: /public/logo.svg (or swap to /logo.png by changing LOGO_SRC)
 *
 * To use a custom PNG instead of the SVG: save your file to
 *   /Users/ravindrasingh/Desktop/finkist/public/logo.png
 * then change LOGO_SRC below to "/logo.png".
 */
const LOGO_SRC = "/logo.svg";

interface LogoProps {
  /**
   * mark    → icon only (compact)
   * lockup  → icon + "CreditSpeed" wordmark (default — use in nav/footer)
   * compact → icon + "CS" (very tight spaces)
   */
  variant?: "mark" | "lockup" | "compact";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** Wrap in <Link href="/">. Default true. */
  asLink?: boolean;
}

const sizeMap = {
  sm: { mark: 24, text: "text-[15px]", gap: "gap-2" },
  md: { mark: 32, text: "text-lg", gap: "gap-2.5" },
  lg: { mark: 40, text: "text-xl", gap: "gap-3" },
  xl: { mark: 64, text: "text-3xl", gap: "gap-4" },
};

export function LogoMark({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  // Plain <img> avoids next/image SVG security warning + is fine for a tiny static logo
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={LOGO_SRC}
      alt="Credit Speed"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}

export default function Logo({
  variant = "lockup",
  size = "md",
  className = "",
  asLink = true,
}: LogoProps) {
  const cfg = sizeMap[size];

  const content = (() => {
    if (variant === "mark") {
      return <LogoMark size={cfg.mark} className={className} />;
    }

    if (variant === "compact") {
      return (
        <span className={`inline-flex items-center ${cfg.gap} ${className}`}>
          <LogoMark size={cfg.mark} />
          <span className={`font-apple font-semibold tracking-tight ${cfg.text} leading-none`}>
            <span className="text-[var(--text-primary)]">C</span>
            <span className="text-gold-400">S</span>
          </span>
        </span>
      );
    }

    // lockup (default)
    return (
      <span className={`inline-flex items-center ${cfg.gap} ${className}`}>
        <LogoMark size={cfg.mark} />
        <span className={`font-apple font-semibold tracking-tight ${cfg.text} leading-none`}>
          <span className="text-[var(--text-primary)]">Credit</span>
          <span className="text-gold-400">Speed</span>
        </span>
      </span>
    );
  })();

  if (!asLink) return content;

  return (
    <Link href="/" className="inline-flex items-center" aria-label="Credit Speed home">
      {content}
    </Link>
  );
}

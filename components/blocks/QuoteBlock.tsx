import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import LaserSignature from "./LaserSignature";

// ─── Style option types ───────────────────────────────────────────────────────

export type QuoteStyleOptions = {
  color?:     "none" | "brand" | "canvas" | "surface";
  alignment?: "left" | "center";
  size?:      "large" | "small";
};

// ─── CVA variants ─────────────────────────────────────────────────────────────

const sectionCva = cva("px-md lg:px-lg", {
  variants: {
    color: {
      none:    "",
      brand:   "bg-brand-fill",
      canvas:  "bg-canvas",
      surface: "bg-surface",
    },
    size: {
      large: "py-xl",
      small: "py-lg",
    },
  },
  defaultVariants: { color: "canvas", size: "large" },
});

const figureCva = cva("", {
  variants: {
    alignment: {
      left:   "max-w-screen-lg",
      center: "mx-auto max-w-screen-md",
    },
  },
  defaultVariants: { alignment: "left" },
});

/**
 * Quote mark: a large `"` glyph in Syne 700.
 *
 * Uses the same font as the quote body for visual continuity.
 * Brand teal color with a layered text-shadow glow — same material language
 * as the laser signature below. Unmistakably a quotation mark; never ornamental.
 *
 * On brand surface: near-white at 55% opacity (legible but recessed).
 */
const quoteMarkCva = cva(
  "block select-none pointer-events-none font-syne font-bold leading-none",
  {
    variants: {
      color: {
        none:    "text-brand qm-glow",
        brand:   "text-fg-on-brand/55",
        canvas:  "text-brand qm-glow",
        surface: "text-brand qm-glow",
      },
      alignment: {
        left:   "",
        center: "text-center",
      },
    },
    defaultVariants: { color: "canvas", alignment: "left" },
  }
);

/**
 * Quote text: Syne 700 — the font's character carries the weight.
 * No italic. Tight tracking. Capped at 52ch for readability.
 */
const quoteTextCva = cva(
  "font-syne font-bold text-pretty max-w-[52ch] leading-[1.15] tracking-[-0.02em]",
  {
    variants: {
      color: {
        none:    "text-fg",
        brand:   "text-fg-on-brand",
        canvas:  "text-fg",
        surface: "text-fg",
      },
      size: {
        large: "text-headline",
        small: "text-title",
      },
      alignment: {
        left:   "",
        center: "mx-auto text-center",
      },
    },
    defaultVariants: { color: "canvas", size: "large", alignment: "left" },
  }
);

const attributionTitleCva = cva(
  "text-label font-normal tracking-label uppercase",
  {
    variants: {
      color: {
        none:    "text-fg-muted",
        brand:   "text-fg-on-brand/55",
        canvas:  "text-fg-muted",
        surface: "text-fg-muted",
      },
    },
    defaultVariants: { color: "canvas" },
  }
);

// ─── Component ────────────────────────────────────────────────────────────────

export type QuoteBlockProps = {
  quote: string;
  attribution: { name: string; title?: string };
  styleOptions?: QuoteStyleOptions;
  pa?: (prop: string) => { "data-epi-property-name"?: string };
};

export default function QuoteBlock({
  quote,
  attribution,
  styleOptions = {},
  pa = () => ({}),
}: QuoteBlockProps) {
  const {
    color     = "canvas",
    alignment = "left",
    size      = "large",
  } = styleOptions;

  const markSize = size === "large"
    ? "clamp(3rem, 5.5vw, 4rem)"
    : "clamp(2.2rem, 4vw, 3rem)";

  return (
    <section className={sectionCva({ color, size })}>
      <figure className={figureCva({ alignment })}>

        {/* ── Quote mark: Syne " with brand teal glow ─────────────────────
          * Large, clearly a quotation mark. Teal text-shadow matches the
          * laser aesthetic below — same material, same glow language. */}
        <span
          aria-hidden="true"
          className={cn(quoteMarkCva({ color, alignment }), "mb-md")}
          style={{ fontSize: markSize }}
        >
          &ldquo;
        </span>

        {/* ── Quote body ────────────────────────────────────────────────── */}
        <blockquote>
          <p
            className={quoteTextCva({ color, size, alignment })}
            {...pa('quote')}
          >
            {quote}
          </p>
        </blockquote>

        {/* ── Signature & attribution ───────────────────────────────────── */}
        <figcaption className={cn(
          "mt-xl",
          alignment === "center" && "flex flex-col items-center"
        )}>
          <LaserSignature
            name={attribution.name}
            color={color}
            epiProps={pa('attributionName')}
          />
          {attribution.title && (
            <p
              className={cn(attributionTitleCva({ color }), "mt-xs")}
              {...pa('attributionTitle')}
            >
              {attribution.title}
            </p>
          )}
        </figcaption>

      </figure>
    </section>
  );
}

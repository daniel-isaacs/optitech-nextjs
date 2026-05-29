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
 * Quote text: Syne 700, bold presence, no italic.
 * Syne's letterforms carry the visual weight; the font is the drama.
 * Capped at 52ch — keeps lines readable on wide viewports.
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

/**
 * Corner bracket mark — the opening quote signal.
 * Two CSS lines (border-top + border-left) forming an L-shape.
 * Graphic, not typographic. Scaled to the block size.
 */
const cornerMarkCva = cva(
  "block select-none pointer-events-none border-t-2 border-l-2",
  {
    variants: {
      color: {
        none:    "border-brand/50",
        brand:   "border-fg-on-brand/40",
        canvas:  "border-brand/50",
        surface: "border-brand/50",
      },
      size: {
        large: "w-7 h-7 mb-lg",
        small: "w-5 h-5 mb-md",
      },
    },
    defaultVariants: { color: "canvas", size: "large" },
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

  return (
    <section className={sectionCva({ color, size })}>
      <figure className={figureCva({ alignment })}>

        {/* ── Corner-bracket quote mark ─────────────────────────────────── */}
        {/* Two-line L-shape: brand teal lines, no typographic glyph */}
        <span aria-hidden="true" className={cornerMarkCva({ color, size })} />

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

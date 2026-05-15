import { cva } from "class-variance-authority";

// ─── Style option types (map 1:1 to CMS content properties) ─────────────────

export type QuoteStyleOptions = {
  /** Background color of the block */
  color?: "brand" | "canvas" | "surface";
  /** Horizontal alignment of quote and attribution */
  alignment?: "left" | "center";
  /** Quote text scale — large for anchor moments, small for lighter placement */
  size?: "large" | "small";
};

// ─── CVA variant configs ─────────────────────────────────────────────────────

const sectionCva = cva("px-md lg:px-lg", {
  variants: {
    color: {
      brand:   "bg-brand",
      canvas:  "bg-canvas",
      surface: "bg-surface",
    },
    size: {
      large: "py-2xl",
      small: "py-xl",
    },
  },
  defaultVariants: { color: "canvas", size: "large" },
});

const figureCva = cva("", {
  variants: {
    alignment: {
      left:   "",
      center: "mx-auto max-w-screen-md text-center",
    },
  },
  defaultVariants: { alignment: "left" },
});

/**
 * Two geometric diamonds — solid at the top, fading to transparent via CSS mask.
 * On dark surfaces: brand teal at full strength.
 * On brand surface: white at 40% opacity so the fade starts more subtly.
 */
const quoteMarkSvgCva = cva("block w-auto pointer-events-none select-none", {
  variants: {
    color: {
      brand:   "text-fg-on-brand opacity-40",
      canvas:  "text-brand",
      surface: "text-brand",
    },
    size: {
      large: "h-24 lg:h-32",
      small: "h-16 lg:h-24",
    },
  },
  defaultVariants: { color: "canvas", size: "large" },
});

const quoteTextCva = cva("text-balance", {
  variants: {
    color: {
      brand:   "text-fg-on-brand",
      canvas:  "text-fg",
      surface: "text-fg",
    },
    size: {
      large: "text-headline leading-headline tracking-headline font-bold",
      small: "text-title leading-title tracking-title font-semibold",
    },
  },
  defaultVariants: { color: "canvas", size: "large" },
});

const attributionNameCva = cva("text-label tracking-label uppercase font-semibold", {
  variants: {
    color: {
      brand:   "text-fg-on-brand",
      canvas:  "text-fg",
      surface: "text-fg",
    },
  },
  defaultVariants: { color: "canvas" },
});

const attributionTitleCva = cva("text-label font-normal", {
  variants: {
    color: {
      brand:   "text-fg-on-brand/60",
      canvas:  "text-fg-muted",
      surface: "text-fg-muted",
    },
  },
  defaultVariants: { color: "canvas" },
});

// ─── Component ───────────────────────────────────────────────────────────────

export type QuoteBlockProps = {
  quote: string;
  attribution: { name: string; title?: string };
  styleOptions?: QuoteStyleOptions;
};

export default function QuoteBlock({
  quote,
  attribution,
  styleOptions = {},
}: QuoteBlockProps) {
  const {
    color     = "canvas",
    alignment = "left",
    size      = "large",
  } = styleOptions;

  return (
    <section className={sectionCva({ color, size })}>
      <figure className={figureCva({ alignment })}>
        {/* Two elongated diamonds — solid at the apex, fade to transparent below */}
        <svg
          aria-hidden="true"
          viewBox="0 0 56 40"
          fill="currentColor"
          className={quoteMarkSvgCva({ color, size })}
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 15%, transparent 92%)",
            maskImage:        "linear-gradient(to bottom, black 15%, transparent 92%)",
          }}
        >
          <polygon points="12,0 24,20 12,40 0,20" />
          <polygon points="44,0 56,20 44,40 32,20" />
        </svg>
        <blockquote className="mt-sm">
          <p className={quoteTextCva({ color, size })}>{quote}</p>
        </blockquote>
        <figcaption className="mt-lg flex flex-col gap-xs">
          <p className={attributionNameCva({ color })}>{attribution.name}</p>
          {attribution.title && (
            <p className={attributionTitleCva({ color })}>{attribution.title}</p>
          )}
        </figcaption>
      </figure>
    </section>
  );
}

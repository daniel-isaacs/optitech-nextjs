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
 * Large Poppins 800 quotation mark — a structural accent, not an icon.
 * On dark surfaces: full brand teal (committed, visible).
 * On brand surface: light ghost at 20% opacity (present but subordinate to copy).
 */
const quoteMarkCva = cva("block leading-none select-none font-extrabold", {
  variants: {
    color: {
      brand:   "text-fg-on-brand/20",
      canvas:  "text-brand",
      surface: "text-brand",
    },
    size: {
      large: "text-[6rem] lg:text-[9rem]",
      small: "text-[3.5rem] lg:text-[5.5rem]",
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
        <span aria-hidden="true" className={quoteMarkCva({ color, size })}>
          &ldquo;
        </span>
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

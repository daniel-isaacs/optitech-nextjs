import {
  ArrowRight, ChevronRight, Zap, ExternalLink, ArrowUpRight,
  Play, Download, Sparkles, Send, Rocket, Star, Plus,
} from "lucide-react";
import Button from "@/components/ui/Button";
import type { ButtonVariant, ButtonSize } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// ─── Style option types ───────────────────────────────────────────────────────

export type ButtonIconKey =
  | "none"
  | "arrowRight"
  | "chevronRight"
  | "zap"
  | "externalLink"
  | "arrowUpRight"
  | "play"
  | "download"
  | "sparkles"
  | "send"
  | "rocket"
  | "star"
  | "plus";

export type ButtonIconPosition = "leading" | "trailing";
export type ButtonAlignment    = "left" | "center" | "right";

export type ButtonBlockStyleOptions = {
  variant?:      ButtonVariant;
  size?:         ButtonSize;
  icon?:         ButtonIconKey;
  iconPosition?: ButtonIconPosition;
  alignment?:    ButtonAlignment;
  fullWidth?:    boolean;
};

export type ButtonBlockProps = {
  label:         string;
  url?:          string;
  styleOptions?: ButtonBlockStyleOptions;
};

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<ButtonIconKey, ReactNode> = {
  none:         null,
  arrowRight:   <ArrowRight />,
  chevronRight: <ChevronRight />,
  zap:          <Zap />,
  externalLink: <ExternalLink />,
  arrowUpRight: <ArrowUpRight />,
  play:         <Play />,
  download:     <Download />,
  sparkles:     <Sparkles />,
  send:         <Send />,
  rocket:       <Rocket />,
  star:         <Star />,
  plus:         <Plus />,
};

const ALIGN_CLASS: Record<ButtonAlignment, string> = {
  left:   "flex justify-start",
  center: "flex justify-center",
  right:  "flex justify-end",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function ButtonBlock({
  label,
  url,
  styleOptions = {},
}: ButtonBlockProps) {
  const {
    variant      = "brand",
    size         = "md",
    icon         = "none",
    iconPosition = "trailing",
    alignment    = "left",
    fullWidth    = false,
  } = styleOptions;

  const iconEl     = ICON_MAP[icon];
  const leadingIcon  = iconEl && iconPosition === "leading"  ? iconEl : undefined;
  const trailingIcon = iconEl && iconPosition === "trailing" ? iconEl : undefined;

  return (
    <div className={cn(ALIGN_CLASS[alignment], "w-full")}>
      <Button
        variant={variant}
        size={size}
        href={url}
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
        className={fullWidth ? "w-full" : undefined}
      >
        {label}
      </Button>
    </div>
  );
}

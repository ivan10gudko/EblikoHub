import type { FC } from "react";
import { cn } from "~/shared/lib";

type ButtonVariants = "fill" | "outline" | "text-only" | "cancel" | "save";

interface SkeletonProps {
  variant?: ButtonVariants;
  className?: string;
}

const skeletonVariants: Record<ButtonVariants, string> = {
  fill: "h-10 w-24 rounded-lg",
  outline: "h-10 w-24 rounded-lg",
  "text-only": "h-6 w-20 rounded",
  cancel: "w-full sm:flex-1 h-12 sm:h-14 rounded-xl",
  save: "w-full sm:flex-[2] h-12 sm:h-14 rounded-xl",
};

const ButtonSkeleton: FC<SkeletonProps> = ({ variant = "fill", className }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-background-muted cursor-default pointer-events-none",
        skeletonVariants[variant],
        className,
      )}
    />
  );
};

export default ButtonSkeleton;

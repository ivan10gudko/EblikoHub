import { cn } from "~/shared/lib/utils";

export const ImageTip = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "text-[11px] text-foreground italic text-center px-4",
        className,
      )}
    >
      {children ||
        "Tip: Use direct links ending in .jpg, .png or .webp for best results."}
    </p>
  );
};

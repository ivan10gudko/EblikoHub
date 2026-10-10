import { useState, type ReactNode } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Button } from "~/shared/ui/Button";
import { cn } from "~/shared/lib";

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  title?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  contentClassName?: string;
}

export const FilterPopover = ({
  trigger,
  children,
  title,
  align = "end",
  side = "bottom",
  sideOffset = 4,
  contentClassName = "",
}: PopoverProps) => {
  const [open, setOpen] = useState(false);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <div className="inline-block cursor-pointer outline-none">{trigger}</div>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align={align}
          side={side}
          sideOffset={sideOffset}
          className={cn(
            "relative w-[calc(100vw-2rem)] max-w-[360px] max-h-[80vh] overflow-y-auto rounded-2xl border-2 border-border bg-card shadow-2xl z-50 p-3 sm:p-5 animate-in fade-in zoom-in-95 duration-150 hide-scrollbar",
            contentClassName
          )}
        >
          {title && (
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4 sticky top-0 bg-card z-10 pt-1">
              <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                {title}
              </span>
              <PopoverPrimitive.Close asChild>
                <Button
                  variant="altCancel"
                  className="h-8 w-14 rounded-lg absolute -top-2 right-0 px-2 py-0 text-xs font-bold cursor-pointer"
                >
                  Close
                </Button>
              </PopoverPrimitive.Close>
            </div>
          )}

          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};
import { useState, type ReactNode } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { Button } from "~/shared/ui/Button";
import { cn } from "~/shared/lib";
import type { Character } from "~/entities/character";
import { CharacterPickerPanel, type CharacterPickerPanelProps } from "./CharacterPickerPanel";

interface CharacterPickerProps extends Omit<CharacterPickerPanelProps, "onSelect" | "autoFocus"> {
  /** Called with the picked character; the dropdown closes right after it. */
  onSelect: (character: Character) => void;
  /** Custom trigger element. Defaults to a "Choose character" button. */
  trigger?: ReactNode;
  label?: string;
  disabled?: boolean;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  contentClassName?: string;
}

/**
 * Single reusable "Choose character" combobox:
 * user's own characters, Tenrai API search and custom creation in one dropdown.
 */
export const CharacterPicker = ({
  onSelect,
  trigger,
  label = "Choose character",
  disabled,
  align = "start",
  side = "bottom",
  contentClassName,
  ...panelProps
}: CharacterPickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        {trigger ?? (
          <Button
            variant="accept"
            disabled={disabled}
            className="h-10 px-4 gap-2 text-sm font-bold"
          >
            <PersonSearchIcon sx={{ fontSize: 18 }} />
            {label}
          </Button>
        )}
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align={align}
          side={side}
          sideOffset={6}
          collisionPadding={12}
          onEscapeKeyDown={(e) => {
            // keep parent modal open, close only the dropdown
            e.stopPropagation();
          }}
          className={cn(
            "z-[3000] flex flex-col w-[calc(100vw-2rem)] max-w-[380px] h-[460px] max-h-[70vh] rounded-2xl border-2 border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden",
            contentClassName
          )}
        >
          <CharacterPickerPanel
            {...panelProps}
            className="h-full"
            onSelect={(character) => {
              onSelect(character);
              setOpen(false);
            }}
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

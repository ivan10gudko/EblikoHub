import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import TuneIcon from "@mui/icons-material/Tune";
import { Button } from "~/shared/ui/Button";
import { TitleFilters } from "~/features/titleFilter";

interface TitleFiltersDropdownProps {
  statusCount?: Record<string, number>;
  typeCount?: Record<string, number>;
}

export const TitleFiltersDropdown = ({
  statusCount,
  typeCount,
}: TitleFiltersDropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="accept"
          className="w-10 h-10 p-0 flex items-center justify-center rounded-xl border border-primary/40 hover:border-primary transition-all duration-200 cursor-pointer"
          title="Sort & Filter"
        >
          <TuneIcon sx={{ fontSize: 20 }} className="text-primary" />
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          side="bottom"
          sideOffset={-40} 
          className="relative w-[calc(100vw-2rem)] max-w-[360px] max-h-[80vh] overflow-y-auto rounded-2xl border-2 border-border bg-card shadow-2xl z-50 p-3 sm:p-5 animate-in fade-in zoom-in-95 duration-150 hide-scrollbar"
        >
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4 sticky top-0 bg-card z-10 pt-1">
            <span className="font-bold text-xs uppercase tracking-wider text-foreground-muted">
              Filters & Sorting
            </span>
            <Popover.Close asChild>
              <Button
                variant="altCancel"
                className="h-8 w-14 rounded-lg absolute -top-2 right-0 px-2 py-0 text-xs font-bold cursor-pointer"
              >
                Close
              </Button>
            </Popover.Close>
          </div>

          <TitleFilters
            compact
            statusCount={statusCount}
            typeCount={typeCount}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
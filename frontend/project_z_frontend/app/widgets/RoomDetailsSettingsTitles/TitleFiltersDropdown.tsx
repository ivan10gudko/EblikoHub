import { useState, useRef, useEffect } from "react";
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
     
      const target = event.target as HTMLElement;
      if (target.closest("[data-radix-portal]")) {
        return;
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <Button
        variant="accent"
        onClick={() => setOpen((prev) => !prev)}
        className="w-10 h-10 p-0 flex items-center justify-center rounded-xl border border-primary/40 hover:border-primary transition-all duration-200"
        title="Sort & Filter"
      >
        <TuneIcon sx={{ fontSize: 20 }} className="text-primary" />
      </Button>

      {open && (
        <div 
         
          className="absolute right-0 top-0 w-[360px] max-h-[80vh] overflow-y-auto rounded-2xl border-2 border-border bg-card shadow-2xl z-50 p-5 animate-in fade-in zoom-in-95 duration-150 hide-scrollbar"
        >
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4 sticky top-0 bg-card z-10 pt-1">
            <span className="font-bold text-xs uppercase tracking-wider text-foreground-muted">
              Filters & Sorting
            </span>
            <Button
              onClick={() => setOpen(false)}
              variant="altCancel"
              className="h-8 w-14 rounded-lg absolute -top-2 right-0 px-2 py-0 text-xs font-bold"
            >
              Close
            </Button>
          </div>

          <TitleFilters
            compact
            statusCount={statusCount}
            typeCount={typeCount}
          />
        </div>
      )}
    </div>
  );
};
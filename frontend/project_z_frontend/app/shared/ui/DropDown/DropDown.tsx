// ~/shared/ui/Dropdown/Dropdown.tsx
import { useState, useRef, useEffect, type ReactNode } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button } from "../Button";
import { Children } from "react";
interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
}

export const Dropdown = ({ trigger, children, align = "right" }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 mt-2 min-w-[160px] bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 
            ${align === "right" ? "right-0" : "left-0"}`}
        >
          <div className="flex flex-col p-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
interface DropdownItemProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
  children: ReactNode,
  variant?: "default" | "danger"
}

export const DropdownItem = ({ onClick, children, variant = "default" }: DropdownItemProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);
  };

  const childrenArray = Children.toArray(children);
  const icon = childrenArray[0];
  const label = childrenArray.slice(1);

  return (
    <Button
      onClick={handleClick}
      className={`w-full flex items-center justify-start gap-3 px-3 py-2.5 text-xs font-bold rounded-lg transition-colors text-left ${
        variant === "danger"
          ? "text-danger hover:bg-danger/10"
          : "text-foreground hover:bg-border/50"
      }`}
    >
      {icon && (
        <span className="flex items-center justify-center w-5 h-5 flex-shrink-0">
          {icon}
        </span>
      )}
      
      <span className="truncate">
        {label}
      </span>
    </Button>
  );
};

export const DeleteDropdownItem = ({ onDelete }: { onDelete: () => void }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <DropdownItem
      onClick={(e) => {
        e.stopPropagation();
        if (!isConfirming) {
          setIsConfirming(true);
        } else {
          onDelete();
        }
      }}
      variant="danger"
    >
      <DeleteOutlineIcon sx={{ fontSize: 16 }} />
      <span>{isConfirming ? "Are you sure?" : "Delete"}</span>
    </DropdownItem>
  );
};
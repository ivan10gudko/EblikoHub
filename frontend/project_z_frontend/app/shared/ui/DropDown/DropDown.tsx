import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState, type ReactNode } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button } from "../Button";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "end" | "center";
}

export const Dropdown = ({ trigger, children, align = "end" }: DropdownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="inline-block cursor-pointer outline-none">
          {trigger}
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={8}
          className="z-[9999] min-w-[160px] bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200"
        >
          <div className="flex flex-col p-1">
            {children}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

interface DropdownItemProps {
  onClick?: (e: Event) => void;
  children: ReactNode;
  variant?: "default" | "danger";
  icon?: ReactNode;
}

export const DropdownItem = ({ onClick, children, variant = "default", icon }: DropdownItemProps) => {
  return (
    <DropdownMenu.Item
      onSelect={onClick}
      className="outline-none border-none list-none"
    >
      <Button
        className={`w-full flex items-center justify-start gap-3 px-3 py-2.5 text-xs font-bold rounded-lg transition-colors text-left border-none shadow-none bg-transparent ${variant === "danger"
          ? "text-danger hover:bg-danger/10"
          : "text-foreground hover:bg-border/50"
          }`}
      >
        {icon && (
          <span className="flex items-center justify-center w-5 h-5 flex-shrink-0">
            {icon}
          </span>
        )}
        <span className="truncate">{children}</span>
      </Button>
    </DropdownMenu.Item>
  );
};

export const DeleteDropdownItem = ({ onDelete }: { onDelete: () => void }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <DropdownItem
      onClick={(e) => {
        e.preventDefault();
        if (!isConfirming) {
          setIsConfirming(true);
        } else {
          onDelete();
        }
      }}
      variant="danger"
      icon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
    >
      {isConfirming ? "Are you sure?" : "Delete"}
    </DropdownItem>
  );
};
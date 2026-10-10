import { NavLink } from "react-router";
import { type ElementType, type ComponentPropsWithoutRef } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { RoomRole } from "~/entities/room/model/room.types";
import { cn } from "~/shared/lib";

export type NavChildItem = {
  key: string;
  label: string;
  path: string;
  Icon: ElementType;
  end?: boolean;
};

export type NavItem =
  | {
      key: string;
      label: string;
      path: string;
      Icon: ElementType;
      allowed: RoomRole[];
      children?: never;
    }
  | {
      key: string;
      label: string;
      path?: never;
      Icon: ElementType;
      allowed: RoomRole[];
      children: NavChildItem[];
    };

interface NavLinkItemProps extends ComponentPropsWithoutRef<"a"> {
  item: Extract<NavItem, { path: string }>;
}

interface NavGroupItemProps extends ComponentPropsWithoutRef<"div"> {
  item: Extract<NavItem, { children: NavChildItem[] }>;
  isOpen: boolean;
  isGroupActive: boolean;
  onToggle: () => void;
  onChildClick?: () => void;
}

const linkBase =
  "flex items-center gap-4 px-5 py-3.5 rounded-xl font-medium transition-all duration-300 border backdrop-blur-sm w-full cursor-pointer";
const linkActive =
  "bg-primary text-background border-primary shadow-[0_0_14px_rgba(251,146,6,0.35)] font-bold translate-x-1";
const linkInactive =
  "text-foreground/80 border-border/40 bg-background-muted/20 hover:bg-background-muted/60 hover:text-foreground hover:border-primary/50 hover:translate-x-1";

export const NavLinkItem = ({ item, className = "", onClick }: NavLinkItemProps) => (
  <NavLink
    to={item.path}
    onClick={onClick}
    className={({ isActive }) =>
      cn(linkBase, isActive ? linkActive : linkInactive, className)
    }
  >
    {({ isActive }) => (
      <span className="flex items-center gap-4 w-full">
        <item.Icon
          className={cn(
            "scale-110 opacity-90",
            isActive ? "" : "text-primary"
          )}
        />
        <span className="text-lg tracking-wide">{item.label}</span>
      </span>
    )}
  </NavLink>
);

export const NavGroupItem = ({
  item,
  isOpen,
  isGroupActive,
  onToggle,
  onChildClick,
  className = "",
}: NavGroupItemProps) => (
  <div className={cn("flex flex-col gap-1 w-full", className)}>
    <button
      type="button"
      onClick={onToggle}
      className={cn(linkBase, isGroupActive ? linkActive : linkInactive)}
    >
      <span className="flex items-center justify-between w-full">
        <span className="flex items-center gap-4">
          <item.Icon
            className={cn(
              "scale-110 opacity-90",
              isGroupActive ? "" : "text-primary"
            )}
          />
          <span className="text-lg tracking-wide">{item.label}</span>
        </span>
        <KeyboardArrowDownIcon
          className={cn(
            "transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </span>
    </button>

    <div
      className={cn(
        "grid transition-all duration-300 ease-in-out pl-4 overflow-hidden",
        isOpen
          ? "grid-rows-[1fr] opacity-100 mt-1.5"
          : "grid-rows-[0fr] opacity-0 pointer-events-none"
      )}
    >
      <div className="flex flex-col gap-1 overflow-hidden">
        {item.children.map((child) => (
          <NavLink
            key={child.key}
            to={child.path}
            end={child.end}
            onClick={onChildClick}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3.5 px-5 py-2 rounded-xl font-medium transition-all duration-200 border w-full",
                isActive
                  ? "bg-primary/10 text-primary border-primary/30 font-semibold"
                  : "text-foreground/70 border-transparent hover:bg-background-muted/40 hover:text-foreground"
              )
            }
          >
            <span className="flex items-center gap-3.5 w-full">
              <child.Icon className="text-primary scale-105 opacity-90" />
              <span className="text-sm tracking-wide">{child.label}</span>
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  </div>
);
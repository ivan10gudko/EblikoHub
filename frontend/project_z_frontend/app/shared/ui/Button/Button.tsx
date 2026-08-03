import type { ComponentProps } from "react";
import { cn } from "~/shared/lib";

type ButtonVariants =
  | "fill"
  | "outline"
  | "text-only"
  | "cancel"
  | "save"
  | "destructive"
  | "resetFilters"
  | "accent"
  | "altCancel";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariants;
}
const baseStyles =
  "px-4 py-2 rounded-lg flex justify-center items-center transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm hover:scale-98";

const variantStyles: Record<ButtonVariants, string> = {
    fill: "bg-primary text-background shadow-sm hover:bg-primary-hover",
    outline: "border-2 border-primary text-background",
  "text-only":
  "text-foreground-muted hover:text-primary hover:underline p-0 bg-transparent",
    cancel:
  "h-12 sm:h-14 rounded-xl border-2 border-border bg-background text-foreground/80 font-bold tracking-wide hover:-translate-y-[2px] hover:bg-background-muted hover:text-foreground hover:shadow-bouncy dark:hover:shadow-[0_4px_0_0_var(--color-border)] active:translate-y-0 active:shadow-none",
  
  
    save:
  "h-12 sm:h-14 rounded-xl bg-primary text-background font-black tracking-wide hover:bg-primary/90 hover:shadow-primary-bouncy active:translate-y-[2px] active:shadow-primary-bouncy-active",
    destructive:
  "border-2 border-danger/40 bg-danger/5 text-danger shadow-sm hover:bg-danger hover:text-background hover:border-danger",

  //ну така червона кнопочка для скасування дії або  видалення друга
    altCancel:
  "bg-danger/10 border border-danger/30 " +
  "text-danger hover:text-danger " +
  "hover:bg-danger/20 hover:border-danger/60 " +
  "rounded-xl gap-2 px-4 py-2 " +
  "transition-all duration-200 " +
  "shadow-sm hover:shadow-[0_0_12px_rgba(220,38,38,.15)] " +
  "active:scale-[0.97]",
  
  // Стиль для кнопки с функцією скидання фільтрів
    resetFilters:"w-full h-12 flex items-center justify-center " +
  "rounded-xl border border-danger/40 " +
  "bg-danger/15 hover:bg-danger/20 " +
  "text-danger/80 hover:text-danger " +
  "font-semibold tracking-wide text-sm " +
  "transition-all duration-200 " +
  "hover:border-danger hover:shadow-md " +
  "active:scale-[0.97] cursor-pointer",

// Стиль для кнопки для додавання друзів по типу того 
     accent:
   "h-11 px-5 rounded-xl " +
  "bg-transparent bg-primary/10 " +
  "border border-primary/40 " +
  "text-primary " +
  "hover:bg-primary/10 " +
  "hover:border-primary " +
  "transition-all duration-200 " +
  "active:scale-[0.98]" 

};


const Button = ({
  children,
  variant = "fill",
  className,
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

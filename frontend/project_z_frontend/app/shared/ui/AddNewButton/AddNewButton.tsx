import AddIcon from "@mui/icons-material/Add";
import { Button } from "~/shared/ui/Button";

interface AddTitleButtonProps {
  onClick: () => void;
  variant?: "long" | "card";
  placeholder?: string;
}

export const AddNewButton = ({ onClick, variant = "long", placeholder }: AddTitleButtonProps) => {
  if (variant === "card") {
    return (
      <button
        onClick={onClick}
        className="flex flex-col min-h-40 cursor-pointer items-center justify-center gap-2 w-full bg-background-muted hover:bg-background-muted-hover border-2 border-dashed border-border hover:border-primary rounded-2xl transition-all duration-200"
      >
        <div className="flex items-center justify-center w-10 h-10 bg-background rounded-full shadow-sm">
          <AddIcon className="text-primary" />
        </div>
        <span className="text-sm font-bold text-foreground">Add new {placeholder}</span>
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="group flex cursor-pointer items-center justify-center gap-3 w-full py-3 bg-background-muted hover:bg-background-muted-hover border-2 border-dashed border-border hover:border-primary rounded-2xl transition-all duration-200"
    >
      <div className="flex items-center justify-center w-8 h-8 bg-background group-hover:bg-primary-hover rounded-full shadow-sm transition-colors">
        <AddIcon className="text-foreground group-hover:text-background transition-colors" sx={{ fontSize: 20 }} />
      </div>
      <span className="font-bold text-foreground group-hover:text-primary-hover transition-colors">
        Add new {placeholder}
      </span>
    </Button>
  );
};
import { Button } from "../Button";

interface ModalFooterProps {
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
}

export const ModalFooter = ({
  onCancel,
  onSave,
  isSaving = false,
  saveLabel = "Save",
  cancelLabel = "Cancel",
}: ModalFooterProps) => {
  return (
    <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 border-t border-border">
      <Button
        variant="outline"
        className="text-foreground bg-card border-none w-full sm:flex-1 h-12 sm:h-14 rounded-xl font-bold"
        onClick={onCancel}
        disabled={isSaving}
      >
        {cancelLabel}
      </Button>
      <Button
        className="w-full sm:flex-[2] h-12 sm:h-14 rounded-xl bg-primary text-foreground font-black tracking-wide shadow-[0_4px_0_0_#d97706] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : saveLabel}
      </Button>
    </div>
  );
};
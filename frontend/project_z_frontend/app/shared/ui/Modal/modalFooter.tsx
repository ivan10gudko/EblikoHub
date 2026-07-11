import { Button } from "../Button";

interface ModalFooterProps {
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  isOwn?: boolean;
}

export const ModalFooter = ({
  onCancel,
  onSave,
  isSaving = false,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  isOwn = true,
}: ModalFooterProps) => {
  
  const styles = {
    container: "flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 border-t border-border shrink-0",
    cancelBtn: "w-full sm:flex-1 h-12 sm:h-14 rounded-xl border-2 border-border bg-background text-foreground/80 font-bold tracking-wide hover:-translate-y-[2px] hover:bg-background-muted hover:text-foreground hover:shadow-[0_4px_0_0_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_0_0_var(--color-border)] active:translate-y-0 active:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer",
    saveBtn: "w-full sm:flex-[2] h-12 sm:h-14 rounded-xl bg-primary text-background font-black tracking-wide shadow-[0_4px_0_0_#d97706] hover:bg-primary/90 hover:shadow-[0_4px_0_0_#b45309] active:translate-y-[2px] active:shadow-[0_2px_0_0_#b45309] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
  };

  return (
    <div className={styles.container}>
      <Button
        variant="outline"
        className={styles.cancelBtn}
        onClick={onCancel}
        disabled={isSaving}
      >
        {isOwn ? cancelLabel : "Close"}
      </Button>

      {isOwn && (
        <Button
          className={styles.saveBtn}
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : saveLabel}
        </Button>
      )}
    </div>
  );
};
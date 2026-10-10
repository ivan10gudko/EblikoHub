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
  return (
    <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 border-t border-border shrink-0">
      <Button
        variant="cancel"
        className="w-full sm:flex-1"
        onClick={onCancel}
        disabled={isSaving}
      >
        {isOwn ? cancelLabel : "Close"}
      </Button>

      {isOwn && (
        <Button
          variant="save"
          className="w-full sm:flex-2"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : saveLabel}
        </Button>
      )}
    </div>
  );
};

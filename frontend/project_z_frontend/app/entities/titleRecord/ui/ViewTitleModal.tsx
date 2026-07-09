import Modal from "~/shared/ui/Modal/Modal";
import { Button } from "~/shared/ui/Button";
import type { TitleRecord } from "~/entities/titleRecord";
import { titleTypeOptions, TitleTypeOptionsColors } from "~/entities/titleRecord";
import { CompactRate } from "~/shared/ui/CompactRate";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PushPinIcon from "@mui/icons-material/PushPin";
import { ReadOnlyStatusBadge } from "~/entities/titleRecord";

interface ViewTitleModalProps {
  title: TitleRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onEditClick?: () => void;
  isOwn?: boolean;
}

export const ViewTitleModal = ({
  title,
  isOpen,
  onClose,
  onEditClick,
  isOwn,
}: ViewTitleModalProps) => {
  if (!title) return null;

  const currentTypeLabel = titleTypeOptions.find(o => o.value === title.titleType)?.label || title.titleType;
  const typeColorClass = TitleTypeOptionsColors[title.titleType] || "text-foreground";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title.titleName}
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col max-h-[70vh] h-full justify-between p-2">
        <div className="overflow-y-auto flex-1 pr-2 pb-6 space-y-6 custom-scrollbar min-h-0">
          
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
            <img 
              src={title.imageUrl || "/defaultTitleRecordImage.jpg"} 
              alt={title.titleName} 
              className="w-40 h-56 object-cover rounded-xl shadow-md border border-border/40 shrink-0"
            />

            <div className="flex-1 space-y-4 w-full">
              <div>
                <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block mb-1">
                  Title Name
                </span>
                <h2 className="text-2xl font-black text-foreground uppercase leading-tight">
                  {title.titleName}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block mb-1">
                    Type
                  </span>
                  <span className={`font-black text-sm uppercase tracking-wider ${typeColorClass}`}>
                    {currentTypeLabel}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block mb-1">
                    Status
                  </span>
                  <div className="inline-block">
                    <ReadOnlyStatusBadge status={title.status} />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block mb-1">
                  Rating
                </span>
                <div className="pointer-events-none opacity-90 inline-block">
                  <CompactRate currentRating={title.rating?.overall} avgRating={title.avgRating} />
                </div>
              </div>
            </div>
          </div>

          {/* Опис */}
          <div className="space-y-2 border-t border-border/40 pt-4">
            <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block ml-1">
              Description & Notes
            </span>
            <div className="w-full p-4 border-2 border-border/60 bg-card/30 rounded-xl font-medium text-foreground text-sm leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
              {title.description?.trim() ? title.description : (
                <span className="text-muted-foreground italic opacity-60">No description provided yet.</span>
              )}
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground/60 font-medium px-1 flex justify-between items-center pt-2">
            {title.createdAt && (
              <span className="flex items-center gap-1">
                <CalendarMonthIcon sx={{ fontSize: 14 }} />
                Added: {new Date(title.createdAt).toLocaleDateString()}
              </span>
            )}
            {title.pinned && (
              <span className="text-primary font-bold flex items-center gap-0.5">
                <PushPinIcon sx={{ fontSize: 14, transform: 'rotate(45deg)' }} />
                Pinned Title
              </span>
            )}
          </div>

        </div>

        <div className="flex gap-3 pt-4 border-t border-border bg-background mt-auto shrink-0">
          <Button
            onClick={onClose}
            variant="outline"
            className="text-foreground bg-card border-none flex-1 h-14 rounded-xl font-bold"
          >
            Close
          </Button>
          
          {isOwn && onEditClick && (
            <Button
              onClick={() => {
                onClose();
                onEditClick();
              }}
              className="flex-[1.5] h-14 rounded-xl bg-primary text-foreground font-black tracking-wide shadow-[0_4px_0_0_#d97706] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <EditIcon sx={{ fontSize: 18 }} />
              Edit Details
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
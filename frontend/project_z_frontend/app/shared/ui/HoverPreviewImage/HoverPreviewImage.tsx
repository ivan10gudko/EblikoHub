import * as HoverCard from "@radix-ui/react-hover-card";
import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import { cn } from "~/shared/lib";

interface TitleHoverPreviewProps {
  imageUrl?: string;
  titleName: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  previewClassName?: string;
}

export const TitleHoverPreview = ({
  imageUrl,
  titleName,
  onClick,
  className,
  previewClassName,
}: TitleHoverPreviewProps) => {
  const imageSrc = imageUrl || DEFAULT_IMAGE_PATH;

  return (
    <HoverCard.Root openDelay={150} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <div
          onClick={onClick}
          className={cn(
            "w-12 h-16 shrink-0 overflow-hidden rounded-lg bg-background-muted cursor-pointer transition-transform hover:scale-105",
            className
          )}
        >
          <img
            src={imageSrc}
            alt={titleName}
            className="w-full h-full object-cover"
          />
        </div>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          side="right"
          align="center"
          sideOffset={12}
          className={cn(
            "z-[3000] w-40 h-56 rounded-xl overflow-hidden shadow-2xl border border-border bg-card animate-in fade-in zoom-in-95 duration-150 pointer-events-none",
            previewClassName
          )}
        >
          <img
            src={imageSrc}
            alt={titleName}
            className="w-full h-full object-cover"
          />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};
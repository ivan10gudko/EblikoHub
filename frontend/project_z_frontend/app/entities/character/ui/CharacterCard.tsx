import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import { ImageWithFallback } from "~/shared/ui/ImageWithFallback";
import { cn } from "~/shared/lib";
import type { Character } from "../model/character.types";

interface CharacterCardProps {
    character: Pick<Character, "name" | "imageUrl" | "apiId">;
    className?: string;
    imageClassName?: string;
    showSource?: boolean;
}

export const CharacterSourceBadge = ({ apiId }: { apiId?: number | null }) => (
    <span
        className={cn(
            "px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
            apiId
                ? "text-primary border-primary/40 bg-primary/10"
                : "text-foreground-muted border-border bg-background-muted"
        )}
    >
        {apiId ? "MAL" : "Custom"}
    </span>
);

export const CharacterCard = ({
    character,
    className,
    imageClassName,
    showSource = false,
}: CharacterCardProps) => {
    return (
        <div className={cn("flex items-center gap-4 min-w-0", className)}>
            <ImageWithFallback
                key={character.imageUrl ?? "empty"}
                src={character.imageUrl || DEFAULT_IMAGE_PATH}
                fallback={DEFAULT_IMAGE_PATH}
                alt={character.name}
                className={cn(
                    "w-20 h-28 object-cover rounded-xl shadow-md border border-border/40 shrink-0",
                    imageClassName
                )}
            />
            <div className="min-w-0 space-y-1.5">
                <p className="font-black text-foreground text-lg leading-tight line-clamp-2" title={character.name}>
                    {character.name}
                </p>
                {showSource && <CharacterSourceBadge apiId={character.apiId} />}
            </div>
        </div>
    );
};

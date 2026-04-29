import FileDownloadIcon from '@mui/icons-material/FileDownload';
import type { Anime, AnimeCardType } from '~/entities/title';
import { Button } from '~/shared/ui/Button';

interface AnimeSearchResultsProps {
    results: AnimeCardType[];
    onSelect: (anime: AnimeCardType) => void;
    onClose: () => void;
}
const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";
export const AnimeSearchResults = ({ results, onSelect, onClose }: AnimeSearchResultsProps) => {

    if (results.length === 0) return null;

    const handleImport = (e: React.MouseEvent, anime: AnimeCardType) => {
        e.stopPropagation();
        onSelect(anime);
        onClose();
    };

    const handleImageClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        window.open(`/anime/${id}`, "_blank", "noreferrer");
    };

    return (
        <div className="absolute left-0 right-0 z-[100] mt-1 bg-background border-2 border-border rounded-xl overflow-hidden shadow-2xl">
            <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
                {results.map((anime) => (
                    <div
                        key={anime.id}
                        className="flex items-center gap-3 p-5 hover:bg-background-muted cursor-pointer transition-colors border-b border-border last:border-0"
                        onClick={(e) => handleImageClick(e, anime.id)}
                    >
                        <img
                            src={anime.img || DEFAULT_IMAGE_PATH}
                            className="h-12 w-12 min-w-[36px] object-cover rounded shadow-sm duration-500 hover:scale-[2.0] hover:z-10"
                            alt={anime.title}
                        />
                        <div className="flex-grow min-w-0">
                            <p className="font-bold text-foreground text-sm leading-tight truncate">
                                {anime.title}
                            </p>
                        </div>
                        <Button
                            onClick={(e) => handleImport(e, anime)}
                            className="p-1 hover:bg-primary/70 rounded-full transition-colors"
                            title="Import to my list"
                        >
                            <FileDownloadIcon className="text-primary shrink-0" fontSize="small" />
                        </Button>
                    </div>
                ))}
                <div className="p-2 bg-background-muted border-t border-border flex justify-end">
                    <Button
                        onClick={onClose}
                        className="text-xs font-bold text-foreground-muted hover:text-foregroundpx-3 py-1 transition-colors"
                    >
                        Cancel Search
                    </Button>
                </div>
            </div>
        </div>
    );
};
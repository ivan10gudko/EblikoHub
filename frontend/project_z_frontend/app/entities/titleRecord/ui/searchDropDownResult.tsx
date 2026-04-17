import FileDownloadIcon from '@mui/icons-material/FileDownload';
import type { Anime, AnimeCardType } from '~/entities/title';
import { Button } from '~/shared/ui/Button';

interface AnimeSearchResultsProps {
    results: AnimeCardType[];
    onSelect: (anime: AnimeCardType) => void;
    onClose: () => void;
}

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
        <div className="absolute left-0 right-0 z-[100] mt-1 bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-2xl">
            <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
                {results.map((anime) => (
                    <div
                        key={anime.id}
                        className="flex items-center gap-3 p-5 hover:bg-amber-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0"
                        onClick={(e) => handleImageClick(e, anime.id)}
                    >
                        <img
                            src={anime.img || "/defautlTitleRecordImage.jpg"}
                            className="h-12 w-12 min-w-[36px] object-cover rounded shadow-sm duration-500 hover:scale-[2.0] hover:z-10"
                            alt={anime.title}
                        />
                        <div className="flex-grow min-w-0">
                            <p className="font-bold text-gray-900 text-sm leading-tight truncate">
                                {anime.title}
                            </p>
                        </div>
                        <Button
                            onClick={(e) => handleImport(e, anime)}
                            className="p-1 hover:bg-amber-200 rounded-full transition-colors"
                            title="Import to my list"
                        >
                            <FileDownloadIcon className="text-amber-500 shrink-0" fontSize="small" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};
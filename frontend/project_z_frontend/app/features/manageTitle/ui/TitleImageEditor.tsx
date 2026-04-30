import { useEffect, useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LinkIcon from "@mui/icons-material/Link";
import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";

interface TitleImageEditorProps {
    imageUrl: string | null;
    onImageChange: (url: string | null) => void;
    defaultImage?: string;
}

const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";

export const TitleImageEditor = ({
    imageUrl,
    onImageChange,
    defaultImage = DEFAULT_IMAGE_PATH,
}: TitleImageEditorProps) => {
    const [tempUrl, setTempUrl] = useState(imageUrl || "");
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setTempUrl(imageUrl || "");
        setImageError(false);
    }, [imageUrl]);

    const handleUrlChange = (value: string) => {
        setTempUrl(value);
        setImageError(false);

        if (!value.trim()) {
            onImageChange(null);
        } else if (value.match(/^https?:\/\/.+/)) {
            onImageChange(value);
        }
    };

    const handleClearImage = () => {
        setTempUrl("");
        onImageChange(null);
        setImageError(false);
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full">
            <div className="relative group">
                <div className="h-[280px] w-[190px] bg-card/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden shadow-xl transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-primary/10">
                    <img
                        src={(imageError || !imageUrl) ? defaultImage : imageUrl}
                        className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                            (!imageUrl || imageError) ? "opacity-20 grayscale" : ""
                        }`}
                        alt="Title Preview"
                        onError={() => setImageError(true)}
                    />
                    {imageUrl && !imageError && (
                        <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button
                                variant="outline"
                                className="rounded-full h-12 w-12 p-0 border-danger text-danger bg-background hover:bg-danger hover:text-white transition-transform active:scale-90"
                                onClick={handleClearImage}
                            >
                                <DeleteForeverIcon sx={{ fontSize: 28 }} />
                            </Button>
                        </div>
                    )}
                </div>
                
                <div className="absolute -bottom-2 inset-x-4 h-4 bg-primary/20 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="w-full space-y-3">
                <div className="flex items-center justify-between px-1">
                    <label className="text-xs tracking-[0.2em] text-foreground flex items-center gap-2">
                        <LinkIcon sx={{ fontSize: 14 }} className="text-primary" />
                        Poster Source URL
                    </label>
                    {tempUrl && (
                        <span className={`text-[10px] font-bold uppercase ${imageError ? 'text-danger' : 'text-primary/60'}`}>
                            {imageError ? 'Invalid Link' : 'Link Detected'}
                        </span>
                    )}
                </div>

                <div className="relative group/input">
                    <Input
                        type="text"
                        name="Title image url"
                        autoComplete="off"
                        placeholder="https://example.com/anime-poster.jpg"
                        value={tempUrl}
                        onChange={(val) => handleUrlChange(val)}
                        className={`h-12 w-full pl-4 pr-12 border-2 rounded-xl font-medium bg-background/50 transition-all shadow-inner ${
                            imageError && tempUrl 
                            ? 'border-danger/50 focus:border-danger' 
                            : 'border-border/50 focus:border-primary focus:bg-background'
                        }`}
                    />
                    
                    {tempUrl && (
                        <Button
                            onClick={handleClearImage}
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground hover:text-danger transition-all hover:scale-110"
                        >
                            <DeleteForeverIcon sx={{ fontSize: 22 }} />
                        </Button>
                    )}
                </div>

                {imageError && tempUrl && (
                    <div className="flex items-center gap-2 px-1 animate-in fade-in slide-in-from-top-1">
                        <span className="h-1 w-1 rounded-full bg-danger" />
                        <p className="text-danger text-[11px] font-bold">
                            Could not load image. Please check the URL.
                        </p>
                    </div>
                )}

                <p className="text-[11px] text-foreground italic text-center px-4">
                    Tip: Use direct links ending in .jpg, .png or .webp for best results.
                </p>
            </div>
        </div>
    );
};
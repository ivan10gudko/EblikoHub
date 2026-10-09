import { useState } from "react";
import { Button } from "~/shared/ui/Button";
import { TitleSearch, type AnimeCardType } from "~/entities/title";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { formatRatingInput } from "~/shared/helpers/formatRating";
import { Status, statusOptions } from "~/shared/types/Status";
import { notify } from "~/shared/lib";
import { ImageUrlEditor } from "~/shared/ui/ImageUrlEditor";
import { getStatusColor } from "~/shared/utils";
import Select from "~/shared/ui/Select";
import { useSeasons, type CreateSeasonDto } from "~/entities/season";
import { SEASON_TYPE_OPTIONS, SeasonType } from "~/entities/season/model/season.types";
import { useNavigate } from "react-router";

const INITIAL_FORM_DATA: CreateSeasonDto = {
    name: "",
    apiTitleId: undefined,
    status: Status.INPROGRESS,
    type: SeasonType.TV,
    imageUrl: "",
    rating: undefined,
    description: "",
};

interface AddSeasonScreenProps {
    titleId: number;
    onClose: () => void;
}

export const AddSeasonScreen = ({ titleId, onClose }: AddSeasonScreenProps) => {
    const [formData, setFormData] = useState<CreateSeasonDto>(INITIAL_FORM_DATA);
    const { createSeason, isPending: isCreating } = useSeasons(titleId);
    const handleImport = (anime: AnimeCardType) => {
        setFormData({
            ...formData,
            name: anime.title,
            apiTitleId: anime.id,
            imageUrl: anime.img,
        });
    };

    const handleClear = () => {
        setFormData(INITIAL_FORM_DATA);
        notify.success("Form cleared");
    };

    const handleSaveSubmit = () => {
        if (!formData.name.trim()) {
            notify.error("Enter season name!");
            return;
        }

        createSeason(formData, {
            onSuccess: () => {
                setFormData(INITIAL_FORM_DATA);
                onClose();
            },
        });
    };

    const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatRatingInput(e.target.value);

        if (formatted !== null) {
            setFormData((prev) => ({
                ...prev,
                rating: {
                    ...prev.rating,
                    overall: formatted as unknown as number,
                },
            }));
        }
    };

    const handleImageChange = (url: string | null) => {
        setFormData((prev) => ({ ...prev, imageUrl: url ?? "" }));
    };

    return (
        <div className="flex flex-col h-[70vh] px-1 sm:px-0">
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-3 custom-scrollbar space-y-6 p-2">
                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-foreground ml-1 leading-tight uppercase">
                        Quick Import via MAL
                    </label>
                    <TitleSearch onSelect={handleImport} />
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="border-t border-border/50 pt-6 md:border-t-0 md:pt-0">
                        <ImageUrlEditor
                            imageUrl={formData.imageUrl || null}
                            onImageChange={handleImageChange}
                        />
                    </div>

                    <div className="flex-grow space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-foreground ml-1 leading-tight">
                                Season Name
                            </label>
                            <input
                                name="Season name"
                                autoComplete="off"
                                placeholder="Enter season name..."
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className="h-12 w-full px-4 border-2 border-border rounded-xl font-bold text-foreground text-sm focus:border-primary transition-all shadow-sm outline-none"
                            />
                        </div>

                        <div className="w-full">
                            <div className="space-y-2 mb-5">
                                <label className="text-xs font-bold tracking-widest text-muted-foreground ml-1 uppercase opacity-70">
                                    Season Type
                                </label>
                                <div className="w-auto sm:max-w-xs max-w-full">
                                    <Select
                                        value={formData.type ?? SeasonType.TV}
                                        onChange={(val) =>
                                            setFormData({
                                                ...formData,
                                                type: val as SeasonType,
                                            })
                                        }
                                        options={SEASON_TYPE_OPTIONS}
                                        className="h-12 border-2 border-border/60 rounded-xl font-bold text-foreground text-sm shadow-sm w-full"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mb-1">
                                <div className="flex-1">
                                    <label className="text-xs font-bold tracking-widest text-foreground ml-1 uppercase">
                                        Status
                                    </label>
                                </div>
                                <div className="w-[112px] flex-shrink-0">
                                    <label className="text-xs font-bold tracking-widest text-foreground uppercase text-center block">
                                        Rating
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1 min-w-0">
                                    <Select
                                        value={formData.status}
                                        onChange={(val) =>
                                            setFormData({ ...formData, status: val as Status })
                                        }
                                        options={[...statusOptions]}
                                        className="h-12 border-2 border-border rounded-xl font-bold text-foreground text-sm shadow-sm"
                                        triggerColorClass={getStatusColor(formData.status)}
                                        getOptionClass={getStatusColor}
                                    />
                                </div>
                                <div className="w-[112px] flex-shrink-0">
                                    <input
                                        name="Rating"
                                        autoComplete="off"
                                        placeholder="0.0"
                                        value={formData.rating?.overall?.toString() || ""}
                                        onChange={handleRatingChange}
                                        className="h-12 w-full border-2 border-border rounded-xl font-bold text-foreground text-center focus:border-primary transition-all shadow-sm outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-xs font-bold tracking-widest text-muted-foreground ml-1 uppercase opacity-70 block">
                                Description
                            </label>
                            <textarea
                                name="Description"
                                placeholder="Enter season description, plot summary or your notes..."
                                value={formData.description || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                rows={4}
                                className="w-full p-4 border-2 border-border focus:border-primary rounded-xl font-medium text-foreground text-sm bg-background/50 hover:border-border/80 focus:bg-background transition-all shadow-sm resize-none custom-scrollbar outline-none focus:ring-2 focus:ring-primary/10"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 bg-background shrink-0 flex flex-col gap-3 border-t border-border mt-2">
                <div className="flex gap-4">
                    <Button
                        onClick={onClose}
                        variant="cancel"
                        className="w-full sm:flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveSubmit}
                        disabled={isCreating}
                        variant="save"
                        className="w-full sm:flex-2"
                    >
                        {isCreating ? "Saving..." : "Save Season"}
                    </Button>
                </div>

                <Button
                    onClick={handleClear}
                    variant="text-only"
                    className="flex items-center gap-2 text-[10px] tracking-widest text-foreground hover:text-danger transition-colors uppercase py-2 px-4 self-start"
                >
                    <DeleteSweepIcon sx={{ fontSize: 16 }} />
                    Clear Form Data
                </Button>
            </div>
        </div>
    );
};

export default AddSeasonScreen;
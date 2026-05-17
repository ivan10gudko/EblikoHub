import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Modal from "~/shared/ui/Modal/Modal";
import { Button } from "~/shared/ui/Button";
import { Status } from "~/shared/types/Status";
import { seasonService, useSeasonActions, useSeasons, type DraftSeason, type LocalDraftSeason, type Season } from "~/entities/season";
import { SeasonRow } from "./SeasonRow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface SeasonsModalProps {
    titleId: number;
    isOpen: boolean;
    onClose: () => void;
}

export const EditSeasonsModal = ({ titleId, isOpen, onClose }: SeasonsModalProps) => {
    const { seasons: initialSeasons, isLoading, refetch } = useSeasons(titleId);
    const { syncSeasons, isSyncing } = useSeasonActions(titleId, onClose);

    const [localSeasons, setLocalSeasons] = useState<LocalDraftSeason[]>([]);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        if (isOpen) {
            refetch();
        }
    }, [isOpen, refetch]);

    useEffect(() => {
        if (initialSeasons && isOpen) {
            const mapped = initialSeasons.map((s) => ({
                ...s,
                localId: s.seasonId ? String(s.seasonId) : `existing-${Math.random()}`
            }));
            setLocalSeasons(mapped);
        }
    }, [initialSeasons, isOpen]);

    const handleAddSeason = () => {
        if (!newName.trim()) return;

        const newSeason: LocalDraftSeason = {
            seasonId: null,
            localId: `new-${Date.now()}-${Math.random()}`,
            name: newName,
            status: Status.INPROGRESS,
            rating: {}
        };
        setLocalSeasons(prev => [...prev, newSeason]);
        setNewName("");
    };

    const handleRemove = (localId: string) => {
        setLocalSeasons(prev => prev.filter(s => s.localId !== localId));
    };

    const handleUpdate = (localId: string, patch: Partial<LocalDraftSeason>) => {
        setLocalSeasons(prev => prev.map(s =>
            s.localId === localId ? { ...s, ...patch } : s
        ));
    };


    return (
        <Modal
            maxWidth="max-w-2xl"
            isOpen={isOpen}
            onClose={onClose}
            title="Manage Seasons"
        >
            <div className="flex flex-col max-h-[80vh] px-1 sm:px-0">
                <div className="flex-1 overflow-y-auto pr-1 sm:pr-3 space-y-5 p-1 custom-scrollbar">
                    <div className="sticky top-0 z-20 backdrop-blur-md pb-4 bg-background/5">
                        <div className="flex gap-2 p-1.5 sm:p-2 bg-background-muted/50 rounded-2xl border-2 border-primary/30 shadow-sm focus-within:border-primary/60 transition-all">
                            <input
                                placeholder="Add new season..."
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddSeason()}
                                className="flex-1 bg-transparent border-none px-2 sm:px-3 font-bold text-sm placeholder:text-muted-foreground/40 focus:ring-0 min-w-0"
                            />
                            <Button
                                onClick={handleAddSeason}
                                className="bg-primary text-background hover:bg-primary-hover h-9 sm:h-10 px-3 sm:px-5 rounded-xl shadow-lg active:scale-95 transition-all shrink-0"
                            >
                                <AddIcon fontSize="small" />
                                <span className="hidden xs:inline ml-1 font-black uppercase text-[11px]">Add</span>
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] italic opacity-70">
                                Season List
                            </h3>
                        </div>

                        <div className="flex flex-col gap-3 pb-4">
                            {localSeasons.length === 0 ? (
                                <div className="text-center py-10 border-2 border-dashed border-border/20 rounded-3xl text-muted-foreground text-[11px] font-bold uppercase tracking-widest">
                                    Empty List
                                </div>
                            ) : (
                                localSeasons.map((season) => (
                                    <SeasonRow
                                        key={season.localId}
                                        season={season}
                                        titleId={titleId}
                                        onDelete={() => handleRemove(season.localId)}
                                        onUpdate={(patch) => handleUpdate(season.localId, patch)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/50">
                    <Button
                        variant="outline"
                        className="order-2 sm:order-1 text-foreground bg-card/50 border-none w-full sm:flex-1 h-12 rounded-2xl font-bold hover:bg-border/20"
                        onClick={onClose}
                        disabled={isSyncing}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="order-1 sm:order-2 w-full sm:flex-[2] h-12 rounded-2xl bg-primary text-foreground font-black tracking-widest shadow-[0_4px_0_0_#d97706] active:translate-y-[1px] active:shadow-none transition-all"
                        disabled={isSyncing}
                        onClick={() => syncSeasons(localSeasons)} 
                    >
                        {isSyncing ? "Syncing..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
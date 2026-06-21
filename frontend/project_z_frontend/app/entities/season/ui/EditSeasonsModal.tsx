import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Modal from "~/shared/ui/Modal/Modal";
import { Button } from "~/shared/ui/Button";
import { Status } from "~/shared/types/Status";
import { useSeasonActions, useSeasons, type LocalDraftSeason } from "~/entities/season";
import { SeasonRow } from "./SeasonRow";

interface SeasonsModalProps {
    titleId: number;
    titleName: string;
    isOpen: boolean;
    onClose: () => void;
    isOwn: boolean; 
}

export const EditSeasonsModal = ({ titleId, isOpen, onClose, titleName, isOwn }: SeasonsModalProps) => {
    const { seasons: initialSeasons, refetch } = useSeasons(titleId);
    const { syncSeasons, isSyncing } = useSeasonActions(titleId, onClose);

    const [localSeasons, setLocalSeasons] = useState<LocalDraftSeason[]>([]);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        if (isOpen) {
            refetch();
        }
    }, [isOpen, refetch]);

    useEffect(() => {
        if (Array.isArray(initialSeasons) && isOpen) {
            const mapped = initialSeasons.map((s) => ({
                ...s,
                localId: s.seasonId ? String(s.seasonId) : `existing-${Math.random()}`
            }));
            setLocalSeasons(mapped);
        } else if (!initialSeasons && isOpen) {
            setLocalSeasons([]);
        }
    }, [initialSeasons, isOpen]);

    const handleAddSeason = () => {
        if (!newName.trim() || !isOwn) return;

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
        if (!isOwn) return;
        setLocalSeasons(prev => prev.filter(s => s.localId !== localId));
    };

    const handleUpdate = (localId: string, patch: Partial<LocalDraftSeason>) => {
        if (!isOwn) return;
        setLocalSeasons(prev => prev.map(s =>
            s.localId === localId ? { ...s, ...patch } : s
        ));
    };

    const handleSaveChanges = () => {
        if (!isOwn) {
            onClose();
            return;
        }
        const cleanInitial = (initialSeasons || []).map(({ seasonId, name, status, rating }) => ({ seasonId, name, status, rating }));
        const cleanLocal = (localSeasons || []).map(({ seasonId, name, status, rating }) => ({ seasonId, name, status, rating }));

        const hasChanges = JSON.stringify(cleanInitial) !== JSON.stringify(cleanLocal);

        if (!hasChanges) {
            onClose();
            return;
        }

        syncSeasons(localSeasons);
    };

    return (
        <Modal
            maxWidth="max-w-2xl"
            isOpen={isOpen}
            onClose={isOwn ? handleSaveChanges : onClose}
            title={`Manage Seasons "${titleName}"`}
        >
            <div className="flex flex-col max-h-[80vh] px-1 sm:px-0">
                <div className="flex-1 overflow-y-auto pr-1 sm:pr-3 space-y-5 p-1 custom-scrollbar">
                    
                    {isOwn ? (
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
                    ) : (
                        <div className="pt-2" />
                    )}
                    <div className={!isOwn ? "pointer-events-none opacity-80 select-none space-y-5" : "space-y-5"}>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] italic opacity-70">
                                    Season List
                                </h3>
                            </div>

                            <div className="flex flex-col gap-3 pb-4">
                                {!localSeasons || localSeasons.length === 0 ? (
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
                                            isOwn={isOwn}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/50">
                    {isOwn ? (
                        <>
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
                                onClick={handleSaveChanges} 
                            >
                                {isSyncing ? "Syncing..." : "Save Changes"}
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outline"
                            className="text-foreground bg-card/50 border border-border/50 w-full h-12 rounded-2xl font-bold hover:bg-border/20 transition-all cursor-pointer"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};
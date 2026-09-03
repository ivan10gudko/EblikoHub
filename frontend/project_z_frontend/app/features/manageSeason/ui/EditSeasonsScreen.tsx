import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "~/shared/ui/Button";
import { Status } from "~/shared/types/Status";
import {
  useSeasonActions,
  useSeasons,
  type LocalDraftSeason,
} from "~/entities/season";
import { SeasonRow } from "../../../entities/season/ui/SeasonRow";
import { useNavigate } from "react-router";

interface EditSeasonsScreenProps {
  titleId: number;
  isOwn: boolean;
}

export const EditSeasonsScreen = ({
  titleId,
  isOwn,
}: EditSeasonsScreenProps) => {
  const navigate = useNavigate();
  const { seasons: initialSeasons, refetch } = useSeasons(titleId);
  const { syncSeasons, isSyncing } = useSeasonActions(titleId, () => navigate(-1));

  const [localSeasons, setLocalSeasons] = useState<LocalDraftSeason[]>([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (Array.isArray(initialSeasons)) {
      const mapped = initialSeasons.map((s) => ({
        ...s,
        localId: s.seasonId ? String(s.seasonId) : `existing-${Math.random()}`,
      }));
      setLocalSeasons(mapped);
    } else if (!initialSeasons) {
      setLocalSeasons([]);
    }
  }, [initialSeasons]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleAddSeason = () => {
    if (!newName.trim() || !isOwn) return;

    const newSeason: LocalDraftSeason = {
      seasonId: null,
      localId: `new-${Date.now()}-${Math.random()}`,
      name: newName,
      status: Status.INPROGRESS,
      rating: {},
    };
    setLocalSeasons((prev) => [...prev, newSeason]);
    setNewName("");
  };

  const handleRemove = (localId: string) => {
    if (!isOwn) return;
    setLocalSeasons((prev) => prev.filter((s) => s.localId !== localId));
  };

  const handleUpdate = (localId: string, patch: Partial<LocalDraftSeason>) => {
    if (!isOwn) return;
    setLocalSeasons((prev) =>
      prev.map((s) => (s.localId === localId ? { ...s, ...patch } : s)),
    );
  };

  const handleSaveChanges = () => {
    if (!isOwn) {
      handleClose();
      return;
    }
    const cleanInitial = (initialSeasons || []).map(
      ({ seasonId, name, status, rating }) => ({
        seasonId,
        name,
        status,
        rating,
      }),
    );
    const cleanLocal = (localSeasons || []).map(
      ({ seasonId, name, status, rating }) => ({
        seasonId,
        name,
        status,
        rating,
      }),
    );

    const hasChanges =
      JSON.stringify(cleanInitial) !== JSON.stringify(cleanLocal);

    if (!hasChanges) {
      handleClose();
      return;
    }

    syncSeasons(localSeasons);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col h-[65vh] px-1 sm:px-0">
        {isOwn && (
          <div className="pb-4 bg-background z-10 shrink-0">
            <div className="flex gap-2 p-1.5 sm:p-2 bg-background-muted/50 rounded-2xl border-2 border-primary/30 shadow-sm focus-within:border-primary/60 transition-all">
              <input
                placeholder="Add new season..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSeason()}
                className="flex-1 bg-transparent border-none px-2 sm:px-3 font-bold text-sm placeholder:text-muted-foreground/40 focus:ring-0 min-w-0 outline-none text-foreground"
              />
              <Button
                onClick={handleAddSeason}
                className="bg-primary text-background hover:bg-primary-hover h-9 sm:h-10 px-3 sm:px-5 rounded-xl shadow-lg active:scale-95 transition-all shrink-0"
              >
                <AddIcon fontSize="small" />
                <span className="hidden xs:inline ml-1 font-black uppercase text-[11px]">
                  Add
                </span>
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-3 custom-scrollbar">
          <div
            className={
              !isOwn
                ? "pointer-events-none opacity-80 select-none space-y-5"
                : "space-y-5"
            }
          >
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

        <div className="flex gap-3 pt-3 border-t border-border/60 bg-background shrink-0 mt-4">
          <Button
            onClick={handleClose}
            variant="cancel"
            className="w-full sm:flex-1 h-11"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveChanges}
            disabled={isSyncing}
            variant="save"
            className="w-full sm:flex-2 h-11"
          >
            {isSyncing ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};
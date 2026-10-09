import { useEffect, useState } from "react";
import {
  useSeasonActions,
  useSeasons,
  type LocalDraftSeason,
} from "~/entities/season";
import { useNavigate } from "react-router";
import { ModalFooter } from "~/shared/ui/Modal";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "~/shared/ui/Button";
import { cn } from "~/shared/lib/utils";
import { SeasonRow } from "~/entities/season/ui/SeasonRow";
import { AddNewButton } from "~/shared/ui/AddNewButton";



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
            <AddNewButton
              onClick={() => {
                navigate("add")
              }}
              placeholder="season"
            />
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

        <ModalFooter
          onCancel={handleClose}
          onSave={handleSaveChanges}
          isSaving={isSyncing}
          isOwn={isOwn}
          saveLabel="Save Changes"
        />
      </div>
    </div>
  );
};
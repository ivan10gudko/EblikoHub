import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";
import { useEffect, useState } from "react";
import { Status } from "~/shared/types/Status";
import { CompactRate } from "~/shared/ui/CompactRate";
import { notify } from "~/shared/lib/notify";
import { ImageUrlField } from "~/shared/ui/imageUrlField";
import { useNavigate } from "react-router";
import Select from "~/shared/ui/Select";
import { useSeasonActions } from "~/entities/season";
import { SEASON_TYPE_OPTIONS, SeasonType, type Season } from "~/entities/season/model/season.types";
import type { Rating } from "~/shared/types";

interface EditSeasonScreenProps {
  titleId: number;
  season: Season;
}

export const EditSeasonScreen = ({ titleId, season }: EditSeasonScreenProps) => {
  const navigate = useNavigate();
  const [name, setName] = useState(season.name);
  const [imageUrl, setImageUrl] = useState<string | null>(
    season.imageUrl ?? null,
  );
  const [status, setStatus] = useState<Status>(season.status);
  const [rating, setRating] = useState<number | undefined>(
    season.rating?.overall,
  );
  const [type, setType] = useState<SeasonType>(
    season.type ?? SeasonType.TV,
  );
  const [description, setDescription] = useState(season.description ?? "");

  const { updateSeason, isUpdating } = useSeasonActions(titleId);

  useEffect(() => {
    setName(season.name);
    setImageUrl(season.imageUrl ?? null);
    setStatus(season.status);
    setRating(season.rating?.overall);
    setType(season.type ?? SeasonType.TV);
    setDescription(season.description ?? "");
  }, [season]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleSave = () => {
    if (!name.trim()) {
      notify.error("Season name cannot be empty");
      return;
    }

    const hasChanges =
      name !== season.name ||
      imageUrl !== season.imageUrl ||
      status !== season.status ||
      rating !== season.rating?.overall ||
      type !== season.type ||
      description !== (season.description ?? "");

    if (!hasChanges) {
      handleClose();
      return;
    }

    let finalRating: Record<string, number> | undefined = undefined;

    if (rating !== undefined) {
      finalRating = { ...season.rating, overall: rating };
    } else if (season.rating) {
      finalRating = { ...season.rating };
      delete finalRating.overall;
    }

    updateSeason(season.seasonId, {
      name,
      imageUrl: imageUrl ?? undefined,
      status,
      rating: finalRating as Rating,
      type,
      description,
    });

    notify.success("Changes saved successfully");
    handleClose();
  };

  return (
    <div className="flex flex-col gap-4 w-full p-2">
      <ImageUrlField imageUrl={imageUrl} onImageChange={setImageUrl}>
        <div className="flex flex-col gap-5">
          <div className="overflow-y-auto flex-1 space-y-4 pr-1 custom-scrollbar min-h-0">
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
              <ImageUrlField.Preview containerClassName="w-38 h-54 sm:w-40 sm:h-56 shrink-0 rounded-xl overflow-hidden shadow-md border border-border/60" />

              <div className="flex-1 space-y-3.5 w-full text-left">
                <div>
                  <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-70 block mb-1">
                    Season Name
                  </label>
                  <Input
                    value={name}
                    onChange={(val) => setName(val)}
                    placeholder="Enter season name..."
                    className="h-11 border-2 p-3 border-border focus:border-primary rounded-xl font-bold w-full text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-70 block mb-1">
                      Type
                    </label>
                    <Select
                      value={type}
                      onChange={(val: string) => setType(val as SeasonType)}
                      options={SEASON_TYPE_OPTIONS}
                      className="h-11 border-2 border-border/60 rounded-xl font-bold text-foreground text-sm shadow-sm w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-70 block mb-1">
                      Status
                    </label>
                    <Select
                      value={status}
                      onChange={(val) => setStatus(val as Status)}
                      options={[
                        { label: "Watched", value: Status.WATCHED },
                        { label: "Planned", value: Status.PLANNED },
                        { label: "In Progress", value: Status.INPROGRESS },
                        { label: "Dropped", value: Status.DROPPED },
                        { label: "Upcoming", value: Status.UPCOMING },
                      ]}
                      className="h-11 border-2 border-border rounded-xl bg-background font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start pt-0.5">
                  <div>
                    <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-70 block mb-2">
                      Rating
                    </label>
                    <CompactRate
                      currentRating={rating}
                      onRate={(val) => setRating(val)}
                      onClear={() => setRating(undefined)}
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-70 block mb-1">
                      Image URL
                    </label>
                    <ImageUrlField.Input showLabel={false} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 border-t border-border/40 pt-3.5">
              <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-70 block mb-1">
                Description & Notes
              </label>
              <textarea
                name="Description"
                placeholder="Enter season description, plot summary or your notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-3.5 border-2 border-border focus:border-primary rounded-xl font-medium text-foreground text-sm bg-background/50 hover:border-border/80 focus:bg-background transition-all shadow-sm resize-none custom-scrollbar outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-border/60 bg-background shrink-0">
            <Button
              onClick={handleClose}
              variant="cancel"
              className="w-full sm:flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              variant="save"
              className="w-full sm:flex-2 h-11"
            >
              {isUpdating ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </ImageUrlField>
    </div>
  );
};

export default EditSeasonScreen;
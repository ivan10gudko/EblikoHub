import type { Season } from "~/entities/season/model/season.types";
import { SEASON_TYPE_OPTIONS, SeasonTypeOptionsColors } from "~/entities/season/model/season.types";
import { EntityForm } from "~/shared/ui/EntityForm/EntityForm";
import { useEditSeasonForm } from "../hooks/useEditSeasonForm";

interface EditSeasonScreenProps {
  titleId: number;
  season: Season;
}

export const EditSeasonScreen = ({ titleId, season }: EditSeasonScreenProps) => {
  const { formState, setters, isPending, handleClose, handleSave } = useEditSeasonForm(
    titleId,
    season
  );

  return (
    <EntityForm values={formState} setters={setters}>
      <EntityForm.Body>
        <EntityForm.Header>
          <EntityForm.Name label="Season Name" />

          <EntityForm.Row>
            <EntityForm.Type options={SEASON_TYPE_OPTIONS} getColorClass={SeasonTypeOptionsColors} />
            <EntityForm.Status />
          </EntityForm.Row>

          <div className="flex flex-col sm:flex-row gap-4 items-start pt-0.5">
            <EntityForm.Rating />
            <EntityForm.ImageUrl />
          </div>
        </EntityForm.Header>

        <EntityForm.Description />
      </EntityForm.Body>

      <EntityForm.Actions
        onClose={handleClose}
        onSave={handleSave}
        isPending={isPending}
      />
    </EntityForm>
  );
};

export default EditSeasonScreen;
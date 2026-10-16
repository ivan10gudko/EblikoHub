import { TitleSearch } from "~/entities/title";
import { SEASON_TYPE_OPTIONS, SeasonTypeOptionsColors } from "~/entities/season/model/season.types";
import { EntityForm } from "~/shared/ui/EntityForm/EntityForm";
import { useAddSeasonForm } from "../hooks/useAddSeasonForm";

interface AddSeasonScreenProps {
    titleId: number;
    onClose: () => void;
}

export const AddSeasonScreen = ({ titleId, onClose }: AddSeasonScreenProps) => {
    const { formState, setters, isPending, handleImport, handleClear, handleSave } =
        useAddSeasonForm(titleId, onClose);

    return (
        <EntityForm values={formState} setters={setters}>
            <EntityForm.Body>
                <EntityForm.Import label="Quick Import via MAL">
                    <TitleSearch onSelect={handleImport} />
                </EntityForm.Import>

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
                onClose={onClose}
                onSave={handleSave}
                onClear={handleClear}
                isPending={isPending}
                saveText="Save Season"
            />
        </EntityForm>
    );
};

export default AddSeasonScreen;
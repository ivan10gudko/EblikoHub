import { TitleSearch } from "~/entities/title";
import { titleTypeOptions, TitleTypeOptionsColors } from "~/entities/titleRecord";
import { EntityForm } from "~/shared/ui/EntityForm/EntityForm";
import { useAddTitleForm } from "./useAddTitleForm";


export const AddTitleScreen = () => {
  const { formState, setters, isPending, handleImport, handleClear, handleClose, handleSave } =
    useAddTitleForm();

  return (
    <EntityForm values={formState} setters={setters}>
      <EntityForm.Body>
        <EntityForm.Import label="Quick Import via MAL">
          <TitleSearch onSelect={handleImport} />
        </EntityForm.Import>

        <EntityForm.Header>
          <EntityForm.Name label="Title Name" />

          <EntityForm.Row>
            <EntityForm.Type options={titleTypeOptions} getColorClass={TitleTypeOptionsColors} />
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
        onClear={handleClear}
        isPending={isPending}
        saveText="Save Title"
      />
    </EntityForm>
  );
};

export default AddTitleScreen;
import type { TitleRecord } from "~/entities/titleRecord";
import { TitleType, titleTypeOptions, TitleTypeOptionsColors } from "~/entities/titleRecord";
import { EntityForm } from "~/shared/ui/EntityForm/EntityForm";
import { useEditTitleForm } from "../hooks/useEditTitleForm";


interface EditTitleScreenProps {
  title: TitleRecord;
}

export const EditTitleScreen = ({ title }: EditTitleScreenProps) => {
  const { formState, setters, isPending, handleClose, handleSave } = useEditTitleForm(title);

  return (
    <EntityForm values={formState} setters={setters}>
      <EntityForm.Body>
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
        isPending={isPending}
      />
    </EntityForm>
  );
};

export default EditTitleScreen;
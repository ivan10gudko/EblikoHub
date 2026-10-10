import { useTitleRecordMutation } from "..";
import { BaseStatusSelect } from "~/shared/ui/BaseStatusSelect";
import { type ManageTitleRecordProps } from "~/entities/titleRecord";

type StatusSelectProps = ManageTitleRecordProps &
  Partial<Omit<React.ComponentProps<typeof BaseStatusSelect>, "data">>;

const StatusSelect = ({
  initialData,
  titleRecord,
  onStatusChange,
  ...props
}: StatusSelectProps) => {
  const { updateStatus, isAnyActionLoading } = useTitleRecordMutation(
    initialData.apiTitleId,
    initialData,
    titleRecord,
  );

  return (
    <BaseStatusSelect
      data={titleRecord || {}}
      onStatusChange={onStatusChange || updateStatus}
      isLoading={isAnyActionLoading}
      {...props}
    />
  );
};

export default StatusSelect;

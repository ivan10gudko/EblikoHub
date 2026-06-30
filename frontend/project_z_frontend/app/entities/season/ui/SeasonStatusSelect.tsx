import { BaseStatusSelect } from "~/shared/ui/BaseStatusSelect";
import type { CreateSeasonDto, Season } from "~/entities/season";

export type SeasonStatusSelectProps = {
  initialData: CreateSeasonDto;
  titleRecord: Season | CreateSeasonDto;
  variant?: "page" | "card";
} & Omit<React.ComponentProps<typeof BaseStatusSelect>, "data">;

const SeasonStatusSelect = ({
  titleRecord,
  variant = "page",
  className = "",
  ...props
}: SeasonStatusSelectProps) => {
  const styles = {
    page: className,
    card: `my-2 border-none bg-transparent rounded-none py-4 text-center transition-all ${className}`,
  };

  return (
    <BaseStatusSelect
      {...props}
      data={titleRecord || {}}
      className={styles[variant]}
    />
  );
};

export default SeasonStatusSelect;

import {
  TitleType,
  TitleTypeOptionsColors,
  titleTypeOptions,
} from "~/entities/titleRecord/model/titleRecord";
import Select from "~/shared/ui/Select/Select";

interface TitleTypeSelectProps {
  value: string | number;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

const TitleTypeSelect = ({
  value,
  onChange,
  disabled,
  className = "",
  placeholder = "Select type...",
}: TitleTypeSelectProps) => {
  const getTitleTypeColor = (optionValue: string | number) => {
    if (!optionValue) return "text-foreground";
    const upperVal = String(optionValue).trim().toUpperCase() as TitleType;

    if (TitleTypeOptionsColors[upperVal]) {
      return TitleTypeOptionsColors[upperVal];
    }
    return "text-foreground";
  };

  const triggerColorClass = value
    ? getTitleTypeColor(value)
    : "text-foreground-muted";

  return (
    <Select
      placeholder={placeholder}
      options={titleTypeOptions}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={className}
      triggerColorClass={triggerColorClass}
      getOptionClass={getTitleTypeColor}
    />
  );
};

export default TitleTypeSelect;

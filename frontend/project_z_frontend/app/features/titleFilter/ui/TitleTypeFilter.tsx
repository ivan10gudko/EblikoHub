import { Checkbox } from "~/shared/ui/CheckBox";
import { useTitleFilterStore } from "../store/titleFilter.store";
import { TitleType, TitleTypeOptionsColors } from '~/entities/titleRecord';

interface TypeFilterProps {
  typeCount?: Record<string, number>;
}

const getBackendCount = (
  countRecord: Record<string, number> | undefined,
  value: string | undefined
): number => {
  if (!countRecord || value === undefined) return 0;

  const cleanClientKey = value.toUpperCase().replace(/[^A-Z]/g, "");

  const foundKey = Object.keys(countRecord).find((key) => {
    const cleanServerKey = key.toUpperCase().replace(/[^A-Z]/g, "");
    return cleanServerKey === cleanClientKey;
  });

  return foundKey ? countRecord[foundKey] : 0;
};

const TitleTypeFilter = ({ typeCount }: TypeFilterProps) => {
  const { types, toggleType } = useTitleFilterStore();

  
  const typeOptions = Object.values(TitleType).map((type) => {
    
    const formattedLabel = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase().replace("_", " ");
    
    return {
      value: type,
      label: formattedLabel,
      
      color: TitleTypeOptionsColors[type] || "text-foreground", 
    };
  });

  return (
    <div className="flex flex-col gap-3 w-full">
      <label className="text-sm font-bold text-foreground uppercase px-1">
        Title Type
      </label>
      <div className="flex flex-col gap-3 px-1 w-full">
        {typeOptions.map((opt) => {
          const count = getBackendCount(typeCount, opt.value);

          return (
            <Checkbox
              key={opt.value}
              label={opt.label}
              checked={types.includes(opt.value)}
              onChange={() => toggleType(opt.value)}
              labelClassName={opt.color} 
              count={count}
              className="font-semibold transition-all duration-150"
            />
          );
        })}
      </div>
    </div>
  );
};

export default TitleTypeFilter;
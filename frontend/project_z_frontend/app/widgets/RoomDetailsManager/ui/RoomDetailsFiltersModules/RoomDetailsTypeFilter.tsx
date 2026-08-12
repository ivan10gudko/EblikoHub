import { Checkbox } from '~/shared/ui/CheckBox';
import { titleTypeOptions, TitleType, TitleTypeOptionsColors } from '~/entities/titleRecord';
import { useRoomDetailsFilterStore } from '../../store/roomDetailsFilter.store';



export const RoomDetailsTypeFilter = () => {
  const { types, toggleType } = useRoomDetailsFilterStore();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] uppercase font-bold text-muted-foreground">Type</label>
      <div className="grid grid-cols-2 gap-2">
        {titleTypeOptions.map(type => {
          const colorClass = TitleTypeOptionsColors[type.value as TitleType] || "text-foreground/90";

          return (
            <Checkbox
              key={type.value}
            
              label={
                (<span className={`${colorClass} font-medium text-sm transition-colors duration-200`}>
                  {type.label}
                </span>) as unknown as string
              }
              checked={types.includes(type.value as any)}
              onChange={() => toggleType(type.value as any)}
            />
          );
        })}
      </div>
    </div>
  );
};
import { Checkbox } from '~/shared/ui/CheckBox';
import { titleTypeOptions } from '~/entities/titleRecord';
import { useRoomDetailsFilterStore } from '../../store/roomDetailsFilter.store';

export const RoomDetailsTypeFilter = () => {
  const { types, toggleType } = useRoomDetailsFilterStore();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] uppercase font-bold text-muted-foreground">Type</label>
      <div className="grid grid-cols-2 gap-2">
        {titleTypeOptions.map(type => (
          <Checkbox
            key={type.value}
            label={type.label}
            checked={types.includes(type.value as any)}
            onChange={() => toggleType(type.value as any)}
          />
        ))}
      </div>
    </div>
  );
};
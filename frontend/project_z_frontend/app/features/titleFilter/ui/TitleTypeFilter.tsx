import React from "react";
import { useTitleFilterStore } from "../store/titleFilter.store";
import {
  titleTypeOptions,
  TitleTypeOptionsColors,
} from "~/entities/titleRecord";
import Checkbox from "~/shared/ui/CheckBox/CheckBox";

const TypeFilter = () => {
  const { types, toggleType } = useTitleFilterStore();

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-bold text-foreground uppercase px-1">
        Title Type
      </label>
      <div className="flex flex-col gap-2.5 pl-1">
        {titleTypeOptions.map((opt) => {
          const colorClass = TitleTypeOptionsColors[opt.value];

          return (
            <Checkbox
              key={opt.value}
              label={opt.label}
              checked={types.includes(opt.value)}
              onChange={() => toggleType(opt.value)}
              labelClassName={TitleTypeOptionsColors[opt.value]}
              className="transition-all duration-150 font-medium"
            />
          );
        })}
      </div>
    </div>
  );
};

export default TypeFilter;

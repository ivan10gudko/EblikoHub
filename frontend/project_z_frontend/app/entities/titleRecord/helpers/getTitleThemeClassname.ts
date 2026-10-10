import { TitleType, TitleTypeThemes } from "~/entities/titleRecord";


export const getTitleThemeClassname = (type?: string | null): string => {
  if (!type) return "";
  if (Object.values(TitleType).includes(type as TitleType)) {
    return TitleTypeThemes[type as TitleType] || "";
  }
  return "";
};

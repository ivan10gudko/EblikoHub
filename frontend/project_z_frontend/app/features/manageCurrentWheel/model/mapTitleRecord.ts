import type { TitleRecord } from "~/entities/titleRecord";

const mapTitleRecord = (title: TitleRecord): { titleId: number } => {
    if (!title || typeof title.titleId !== 'number') {
        throw new Error("Invalid title record: titleId is missing or not a number.");
    }

    return {
        titleId: title.titleId
    };
}
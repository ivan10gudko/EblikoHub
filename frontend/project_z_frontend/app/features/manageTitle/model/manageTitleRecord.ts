import type { CreateTitleRecord, TitleRecord } from "~/entities/titleRecord";

export interface ManageTitleRecordProps{
    initialData: CreateTitleRecord,
    titleRecord: TitleRecord | null,
}
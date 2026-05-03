import { Status, type CreateTitleRecord, type TitleParams, type TitleRating, type TitleRecord } from "../model/titleRecord"
import type { PageResponse } from "~/shared/types";
import { apiClient, publicClient } from "~/shared/api";

export interface ActionOptions {
    apiTitleId?: number | null;
    initialData: CreateTitleRecord;
    existingTitle?: TitleRecord | null;
}

export interface RateOptions extends ActionOptions {
    score: number | TitleRating; // {} - for delete
}

interface TitleRecordService {
    get(userId: string, params?: TitleParams): Promise<PageResponse<TitleRecord>>;
    post(titleData: CreateTitleRecord): Promise<TitleRecord>;
    put(titleId: number, titleData: TitleRecord): Promise<TitleRecord>;
    patch(titleId: number, titleData: Partial<TitleRecord>): Promise<TitleRecord>;
    delete(titleId: number): Promise<void>;
    patchCustomOrder(titleId:number,newTitlePosition:number) : Promise<void>;
    reindexCustomOrder(userId:string) : Promise<void>;
    getWatched(userId: string): Promise<Array<TitleRecord>>;
    getPlanned(userId: string): Promise<Array<TitleRecord>>;
    getByApiTitleId(jikanId: number): Promise<TitleRecord>;

    rate(options: RateOptions): Promise<TitleRecord>;
    clearRating(options:ActionOptions): Promise<TitleRecord>;
    moveToPlanned(options: ActionOptions): Promise<TitleRecord>;
    markAsWatched(options: ActionOptions): Promise<TitleRecord>;
    markAsDropped(options: ActionOptions): Promise<TitleRecord>;

    saveAction(options: ActionOptions & { data: Partial<TitleRecord> }): Promise<TitleRecord>;
}

export const titleRecordService: TitleRecordService = {
    async get(userId,params) {
        const response = await apiClient.get(`/titles/${userId}`, {
            params
        });
        
        return response.data;
    },
   
    async post(titleData) {
        const response = await apiClient.post(`/titles`,titleData);
        return response.data;
    },

    async put(titleId, titleData) {
        const response = await apiClient.put(`/titles/${titleId}`,titleData);
        
        return response.data;
    },

    async patch(titleId, titleData) {
        const response = await apiClient.patch(`/titles/${titleId}`,titleData);
        
        return response.data;
    },
    async patchCustomOrder(titleId, newTitlePosition){
        await apiClient.patch(`titles/${titleId}/position`,{ customOrder : newTitlePosition});
    
    },
    async reindexCustomOrder(userId){
        await apiClient.post(`titles/${userId}/reindex`);
    },
    async delete(titleId) {
        await apiClient.delete(`/titles/${titleId}`);
    },

    async getWatched(userId) {
        const response = await apiClient.get(`/titles/${userId}/WATCHED`);

        return response.data;
    },

    async getPlanned(userId) {
        const response = await apiClient.get(`/titles/${userId}/PLANNED`);

        return response.data;
    },

    async getByApiTitleId(apiTitleId) {
        const response = await apiClient.get(`/titles/mal/${apiTitleId}`);

        return response.data;
    },

    async saveAction({ apiTitleId, data, initialData, existingTitle }) {
        //try to use title fetched before
        // if not search in database
        const targetId = existingTitle?.titleId;
        
    
        if (targetId) {
            return this.patch(targetId, data);
        }

        if (apiTitleId && typeof apiTitleId === 'number') {
            const existing = await this.getByApiTitleId(apiTitleId).catch(() => null);
            if (existing) return this.patch(existing.titleId, data);
        }

        return this.post({ ...initialData, ...data });
    },

    async rate({ apiTitleId, score, initialData, existingTitle }) {
        const rating = typeof score === 'number' ? { overall: score } : score;
        console.log(rating);
        return this.saveAction({ apiTitleId, data: { rating }, initialData, existingTitle });
    },

    async clearRating({ apiTitleId, initialData, existingTitle }){
        return this.rate({ apiTitleId, score: {} ,initialData, existingTitle })
    },

    async moveToPlanned(options) {
        return this.saveAction({ ...options, data: { status: Status.PLANNED } });
    },

    async markAsWatched(options) {
        return this.saveAction({ ...options, data: { status: Status.WATCHED } });
    },

    async markAsDropped(options) {
        return this.saveAction({ ...options, data: { status: Status.DROPPED } });
    }
};
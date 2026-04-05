import { Status, type CreateTitleRecord, type TitleParams, type TitleRating, type TitleRecord } from "../model/titleRecord"
import type { PageResponse } from "~/shared/types";
import { apiClient, publicClient } from "~/shared/api";

export interface ActionOptions {
    jikanId: number;
    initialData: CreateTitleRecord;
    existingTitle?: TitleRecord | null;
}

export interface RateOptions extends ActionOptions {
    score: number | TitleRating;
}

interface TitleRecordService {
    get(userId: string, params?: TitleParams): Promise<PageResponse<TitleRecord>>;
    post(titleData: CreateTitleRecord): Promise<TitleRecord>;
    put(titleId: number, titleData: TitleRecord): Promise<TitleRecord>;
    patch(titleId: number, titleData: Partial<TitleRecord>): Promise<TitleRecord>;
    delete(titleId: number): Promise<void>;

    getWatched(userId: string): Promise<Array<TitleRecord>>;
    getPlanned(userId: string): Promise<Array<TitleRecord>>;
    getByJikanId(jikanId: number): Promise<TitleRecord>;

    rate(options: RateOptions): Promise<TitleRecord>;
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

    async getByJikanId(jikanId) {
        const response = await apiClient.get(`/titles/mal/${jikanId}`);

        return response.data;
    },

    async saveAction({ jikanId, data, initialData, existingTitle }) {
        //try to use title fetched before
        // if not search in database
        console.log(data)
        const targetId = existingTitle?.titleId;
        
        
        console.log(targetId)
        if (targetId) {
            console.log('patch')
            return this.patch(targetId, data);
        }

         // 2.  Jikan title (id > 0) 
        if (jikanId && jikanId > 0) {
            const existing = await this.getByJikanId(jikanId).catch(() => null);
            if (existing) return this.patch(existing.titleId, data);
        }

        return this.post({ ...initialData, ...data });
    },

    async rate({ jikanId, score, initialData, existingTitle }) {
        const rating = typeof score === 'number' ? { overall: score } : score;
        return this.saveAction({ jikanId, data: { rating }, initialData, existingTitle });
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
export interface SameCriteriaRating{
    titles : Array<TitleRatingComparasionDto>;
    avgRating : number;
}

export interface TitleRatingComparasionDto {
    titleId: number;
    titleName: string;
    ratingValue: number;
}
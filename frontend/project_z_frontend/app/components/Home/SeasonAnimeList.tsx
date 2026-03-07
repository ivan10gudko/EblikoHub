import { useQuery } from "@tanstack/react-query";
import { getSeasonalAnimeList, getSeasonNow, getTopAnimeList } from "~/services/jikanApi";
import AnimeCard, { type AnimeCardType } from "../Card/AnimeCard";
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import { useState } from "react";
import useWindowDimensions from "~/hooks/useWindowDimensions";
import { useCollapsibleList } from "~/hooks/useCallableList";
import CollapsibleSection from "./ColapsableSection";
import { Money } from "@mui/icons-material";
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';

const SeasonAnimeList: React.FC<{}> = ({})=>{

    return <CollapsibleSection<AnimeCardType, number>
        title={<><TrendingUpRoundedIcon /> Popular right now</>}
        queryKey={["seasonal_anime"]}
        queryFn={getSeasonalAnimeList}
        getItemKey={(anime) => anime.id}
        renderItem={(anime) => <AnimeCard data={anime} />}
    />
};

export default SeasonAnimeList;

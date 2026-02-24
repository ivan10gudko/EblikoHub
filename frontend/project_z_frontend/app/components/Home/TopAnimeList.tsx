import { useQuery } from "@tanstack/react-query";
import { getTopAnimeList } from "~/services/MyAnimeList";
import AnimeCard, { type AnimeCardType } from "../Card/AnimeCard";
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import { useState } from "react";
import useWindowDimensions from "~/utils/useWindowDimensions";
import { useCollapsibleList } from "~/hooks/useCallableList";
import CollapsibleSection from "./ColapsableSection";
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';

const TopAnimeList: React.FC<{}> = ({})=>{
    return <CollapsibleSection<AnimeCardType, number>
        title={<><LocalFireDepartmentRoundedIcon /> Top Rated</>}
        queryKey={["top_anime_list"]}
        queryFn={getTopAnimeList}
        getItemKey={(anime) => anime.id}
        renderItem={(anime) => <AnimeCard data={anime} />}
    />
};

export default TopAnimeList;

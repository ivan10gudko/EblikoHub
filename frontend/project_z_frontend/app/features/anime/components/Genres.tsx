import type React from "react";
import type { Genre } from "~/features/anime/types/MyAnimeList.types";
import Badge from "../../../shared/ui/Badge";

import SellOutlinedIcon from '@mui/icons-material/SellOutlined';

interface Props{
    genres: Genre[]
}
const Genres :React.FC<Props>  = ({genres}) => {
    return (
        <div>
        <h2 className="mb-4 flex gap-2 font-normal">
            <SellOutlinedIcon />
            Genres
        </h2>
        <div className="flex gap-3">
            {genres.map((genre)=> <Badge key={genre.mal_id} textColor="black">{genre.name}</Badge>)}
        </div>
        </div>
    );
}

export default Genres;

import type React from "react";

import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import type { Genre } from "../model/animeTitle.types";
import { Badge } from "~/shared/ui/Badge";

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
        <div className="flex gap-3 flex-wrap">
            {genres.map((genre)=> <Badge key={genre.mal_id} textColor="black">{genre.name}</Badge>)}
        </div>
        </div>
    );
}

export default Genres;

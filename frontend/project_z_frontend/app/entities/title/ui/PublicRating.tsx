import type React from "react";
import StarRoundedIcon from '@mui/icons-material/StarRounded';
interface Props{
    rating:number
    scored_by:number|null|undefined
}
const PubicRating :React.FC<Props>  = ({rating,scored_by})=> {
    const l = scored_by?.toString().length ?? 0;
    const votes = scored_by ? scored_by.toString().split('').map((v,i)=>(l-i-1)%3==0?v+" ":v).join(""):null;
    return (
    <div className="py-2 px-3 bg-amber-100 border border-amber-300 rounded-md flex items-center gap-3 ">
        <StarRoundedIcon className="text-amber-300"/>
        <div>
            <h4 className="text-amber-400">{rating}</h4>
            {scored_by && <h4 className="text-xs">{votes} votes</h4>}
        </div>
    </div>

    );
}

export default PubicRating;
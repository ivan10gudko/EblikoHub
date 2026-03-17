import type React from "react";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PubicRating from "./PublicRating";
interface Props{
    year:number | null | undefined,
    studio:string | null | undefined,
    rating: number | null | undefined,
    duration:string | null | undefined,
    scored_by : number| null | undefined,
}
const AnimeStat :React.FC<Props>  = ({year,studio,rating,duration,scored_by})=> {
    return (
    <div className="flex gap-4 text-gray-600 text-normal font-light py-2 my-2">
        {rating && <PubicRating rating={rating} scored_by={scored_by}/>}
        {studio &&
            <div className="flex gap-3 items-center justify-between">
                <ApartmentIcon fontSize="small"/>
                <span className="translate-y-[2px]">{studio}</span>
            </div>
        }
        {year &&
            <div className="flex gap-3 items-center justify-between">
                <CalendarTodayOutlinedIcon fontSize="small"/>
                <span className="translate-y-[2px]">{year}</span>
            </div>
        }
        {duration &&
            <div className="flex gap-3 items-center justify-between">
                <AccessTimeOutlinedIcon fontSize="small"/>
                <span className="translate-y-[2px]">{duration}</span>
            </div>
        }
        
    </div>

    );
}

export default AnimeStat;
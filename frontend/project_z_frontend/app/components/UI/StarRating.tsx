import StarRoundedIcon from '@mui/icons-material/StarRounded';
import React from 'react';
interface Props {
    rating:number,
}
const StarRating: React.FC<Props> = ({rating}) => {

    return (
        <div className="flex justify-center gap-1 py-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                        <StarRoundedIcon
                            key={star}
                            className={`h-6 w-6 ${
                            star <= Math.round(rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-300'
                            }`}
                        />
                    ))}
        </div>
    );
};

export default StarRating;
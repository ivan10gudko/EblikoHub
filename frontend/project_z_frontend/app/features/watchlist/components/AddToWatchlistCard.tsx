import type { Title } from "~/store/watchlist.store";
import useWatchlist from "~/store/watchlist.store";

import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import WatchLaterIcon from '@mui/icons-material/WatchLater';

interface Props{
    item: Title,
}

const AddToWatchlistCard: React.FC<Props>=({item})=>{

        const {watchlist,addTitle,removeTitle} = useWatchlist();
        const isInWatchlist = watchlist.some(title=>title.id===item.id);
        
        function handleWatchlist(e: React.MouseEvent<HTMLLIElement>){
            e.stopPropagation();
            if(!isInWatchlist){
                addTitle(item);
            }else{
                removeTitle(item);
            }
        }

    return (
                            <li onClick={handleWatchlist}>
                        {isInWatchlist ?
                            <>
                                <WatchLaterIcon fontSize="small" />
                                <span className="ml-2">Remove from watchlist</span>
                            </>
                            :
                            <>
                                <WatchLaterOutlinedIcon fontSize="small"/>
                                <span className="ml-2">Add to watchlist</span>
                            </>
                        }
                    </li>
    );
};

export default AddToWatchlistCard;
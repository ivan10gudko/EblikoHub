import type { Title } from "~/store/watchlist.store";
import useWatchlist from "~/store/watchlist.store";

import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import Button from "../../../components/UI/Button";

interface Props{
    item: Title,
}

const WatchlistButton: React.FC<Props>=({item})=>{

        const {watchlist,addTitle,removeTitle} = useWatchlist();
        const isInWatchlist = watchlist.some(title=>title.id===item.id);
        
        function handleWatchlist(e: React.MouseEvent<HTMLElement>){
            e.stopPropagation();
            if(!isInWatchlist){
                addTitle(item);
            }else{
                removeTitle(item);
            }
        }

    return (
            <Button
                variant={isInWatchlist?"fill":"outline"}
                color="rgba(0,0,0,0.85)"
                borderColor="rgba(14,14,14,0.2)"
                bgColor="rgb(236, 238, 242)"
                className={isInWatchlist?"border-0 gap-3":"border-[1px] gap-3"}
                action={handleWatchlist}
            >
                {isInWatchlist?
                    <>
                        <WatchLaterIcon fontSize="small" />
                        Remove from watchlist
                    </>
                :
                    <>
                        <WatchLaterOutlinedIcon fontSize="small"/>
                        Add to watchlist
                    </>
                
                }
            </Button>
    );
};

export default WatchlistButton;
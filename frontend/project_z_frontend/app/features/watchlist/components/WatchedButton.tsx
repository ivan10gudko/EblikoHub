import type { Title } from "~/legacy/store/watchlist.store";

import LibraryAddCheckOutlinedIcon from '@mui/icons-material/LibraryAddCheckOutlined';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import Button from "../../../shared/ui/Button";
import useWatched from "~/legacy/store/watched.store";

interface Props{
    item: Title,
}

const WatchedButton: React.FC<Props>=({item})=>{

        const title = useWatched(state => state.getTitleById(item.id));
        const {addTitle,removeTitle} = useWatched();

    function handleWatched(e: React.MouseEvent<HTMLElement>){
            e.stopPropagation();
            if(!title){
                addTitle({...item,rating :null});
            }else{
                removeTitle(title);
            }
        }

    return (
            <Button
                variant={title?"fill":"outline"}
                color="rgba(0,0,0,0.85)"
                borderColor="rgba(14,14,14,0.2)"
                bgColor="rgb(236, 238, 242)"
                className={title?"border-0 gap-3":"border-[1px] gap-3"}
                action={handleWatched}
            >
                {title?
                    <>
                        < LibraryAddCheckIcon fontSize="small" />
                        Remove from watched
                    </>
                :
                    <>
                        <LibraryAddCheckOutlinedIcon fontSize="small"/>
                        Add to watched
                    </>
                
                }
            </Button>
    );
};

export default WatchedButton;
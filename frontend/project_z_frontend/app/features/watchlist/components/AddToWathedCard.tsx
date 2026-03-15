import type { Title } from "~/store/watchlist.store";
import LibraryAddCheckOutlinedIcon from '@mui/icons-material/LibraryAddCheckOutlined';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import useWatched from "~/store/watched.store";

interface Props{
    item: Title,
}

const AddToWatchedCard: React.FC<Props>=({item})=>{

    const title = useWatched(state => state.getTitleById(item.id));
    const {addTitle,removeTitle} = useWatched();

    function handleWatched(e: React.MouseEvent<HTMLLIElement>){
            e.stopPropagation();
            if(!title){
                addTitle({...item,rating :null});
            }else{
                removeTitle(title);
            }
        }


    return (
        <li className="border-t" onClick={handleWatched}>
            {title ?
            <>
                <LibraryAddCheckIcon fontSize="small"/>
                <span className="ml-2">Remove from watched</span>
            </>
            :
            <>
                <LibraryAddCheckOutlinedIcon fontSize="small"/>
                <span className="ml-2">Add to watched</span>
            </>
            }
        </li>
    );
};

export default AddToWatchedCard;
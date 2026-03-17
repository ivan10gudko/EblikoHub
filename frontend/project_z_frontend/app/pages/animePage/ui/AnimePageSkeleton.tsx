import { AnimeInfoSkeleton } from "~/widgets/AnimeInfo";
import AnimeSidebarSkeleton from "~/widgets/AnimeSidebar/AnimeSidebarSkeleton";


const AnimePageSkeleton : React.FC = ()=>{
    return <div className="sm:flex sm:gap-8 mx-auto my-8 w-[90%] max-w-[1200px] h-fit  pointer-events-none">
            <AnimeSidebarSkeleton/>
            <AnimeInfoSkeleton/>
        </div>
}

export default AnimePageSkeleton;
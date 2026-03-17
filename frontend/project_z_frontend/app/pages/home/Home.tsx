import { Suspense} from "react";
import { HeroSection } from "~/widgets/HeroSection";
import HeroSkeleton from "~/widgets/HeroSection/HeroSkeleton";
import { SeasonAnimeList } from "~/widgets/SeasonAnimeList";
import { TopAnimeList } from "~/widgets/TopAnimeList";


const HomePage : React.FC = ()=> {

    return (
    <>
        <Suspense fallback={<HeroSkeleton />}>
            <HeroSection />
        </Suspense>
        <SeasonAnimeList />
        <TopAnimeList />
    </>
    );
}

export default HomePage;
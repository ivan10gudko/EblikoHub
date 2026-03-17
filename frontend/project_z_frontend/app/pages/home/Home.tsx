import { Suspense, useEffect } from "react";
import HeroSection from "~/widgets/HeroSection/HeroSection";
import HeroSkeleton from "~/widgets/HeroSection/HeroSkeleton";
import Loader from "~/shared/ui/Loader/Loader";
import SeasonAnimeList from "~/widgets/SeasonAnimeList/SeasonAnimeList";
import TopAnimeList from "~/widgets/TopAnimeList/TopAnimeList";


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
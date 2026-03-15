import { Suspense, useEffect } from "react";
import HeroSection from "~/pages/home/components/HeroSection";
import HeroSkeleton from "~/pages/home/components/HeroSkeleton";
import Loader from "~/pages/home/components/Loader";
import SeasonAnimeList from "~/features/anime/components/SeasonAnimeList";
import TopAnimeList from "~/features/anime/components/TopAnimeList";


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
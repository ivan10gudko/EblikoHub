import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Loader } from "../Loader";

interface InfiniteScrollLoaderProps {
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
}

export const InfiniteScrollLoader = ({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
}: InfiniteScrollLoaderProps) => {
    const { ref, inView } = useInView({
        threshold: 0.1,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
    if (!hasNextPage && !isFetchingNextPage) return null;
    return (
        <div ref={ref} className="h-10 w-full flex justify-center items-center py-4">
            {isFetchingNextPage && <Loader />}
        </div>
    );
};
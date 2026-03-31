import { useEffect, useState, type ReactNode } from "react";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";

interface AnimeCardMenuProps {
    parentRef: React.RefObject<HTMLDivElement | null>;
    children: ReactNode;
}

const AnimeCardMenu: React.FC<AnimeCardMenuProps> = ({
    parentRef,
    children,
}) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!isModalOpen) return;

        function handleClickOutside(e: MouseEvent) {
            if (
                parentRef?.current &&
                !parentRef.current.contains(e.target as Node)
            ) {
                setIsModalOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpen]);

    function openModal(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        setIsModalOpen((open) => !open);
    }

    return (
        <>
            <div
                className={`z-20 w-6 h-6 rounded-full
                    absolute  top-1 right-1
                    flex justify-center items-center
                    hover:scale-105  ${isModalOpen ? "bg-black/10 hover:bg-black/95" : "bg-white hover:bg-white/90"}`}
                onClick={openModal}
            >
                {isModalOpen ? (
                    <CloseIcon fontSize="small" className="text-white" />
                ) : (
                    <MoreHorizIcon fontSize="small" />
                )}
            </div>
            {isModalOpen ? (
                <div
                    className="transition-all duration-100 absolute bg-black/80 z-10 w-full top-0 left-0 bottom-0 right-0 py-7"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ul className="divide-y divide-white/15 [&>li]:my-2 [&>li]:w-full [&>li]:py-4 [&>li]:px-8 [&>li]:hover:scale-105 text-sm text-white [&>li]:hover:text-amber-400 [&>li]:text-center">
                        {children}
                    </ul>
                </div>
            ) : null}
        </>
    );
};

export default AnimeCardMenu;

import React from "react";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import clsx from "clsx"; // npm install clsx

interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
    maxButtons?: number;
}

const Pagination: React.FC<Props> = ({
    currentPage,
    totalPages,
    onPageChange,
    maxButtons = 5
}) => {

    const getPageNumbers = () => {
        const pages = [];
        const half = Math.floor(maxButtons / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, currentPage + half);

        if (end - start + 1 < maxButtons) {
            if (start === 1) {
                end = Math.min(totalPages, start + maxButtons - 1);
            } else if (end === totalPages) {
                start = Math.max(1, end - maxButtons + 1);
            }
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    const baseBtnClass = "flex items-center justify-center min-w-[32px] h-8 px-3 rounded-md text-sm font-medium transition-colors duration-200";
    const activeBtnClass = "bg-amber-400 text-white hover:bg-amber-400";
    const inactiveBtnClass = "text-gray-700 hover:bg-gray-100 hover:text-amber-400";
    const navBtnClass = "bg-amber-400 text-white p-2 rounded-md hover:bg-amber-400 disabled:bg-gray-200 disabled:cursor-not-allowed";

    return (
        <div className="flex items-center justify-center gap-2 mt-8 select-none">
            <button
                className={navBtnClass}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous Page"
            >
                <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
            </button>


            {pageNumbers[0] > 1 && (
                <>
                    <button
                        className={clsx(baseBtnClass, inactiveBtnClass)}
                        onClick={() => onPageChange(1)}
                    >
                        1
                    </button>
                    {pageNumbers[0] > 2 && <span className="text-gray-400 px-1">...</span>}
                </>
            )}

            {pageNumbers.map((num) => (
                <button
                    key={num}
                    onClick={() => onPageChange(num)}
                    className={clsx(
                        baseBtnClass,
                        currentPage === num ? activeBtnClass : inactiveBtnClass
                    )}
                >
                    {num}
                </button>
            ))}

            {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="text-gray-400 px-1">...</span>}
                    <button
                        className={clsx(baseBtnClass, inactiveBtnClass)}
                        onClick={() => onPageChange(totalPages)}
                    >
                        {totalPages}
                    </button>
                </>
            )}


            <button
                className={navBtnClass}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
            >
                <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
            </button>
        </div>
    );
};

export default Pagination;
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import {
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
    type MouseEvent,
} from "react";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import { useTitleRecordMutation } from "../../../entities/titleRecord";
import type { ManageTitleRecordProps } from "../model/manageTitleRecord";

const RateCardAction = ({
    initialData,
    titleRecord,
}: ManageTitleRecordProps) => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const { rate, isAnyActionLoading } = useTitleRecordMutation(
        initialData.apiTitleId,
        initialData,
        titleRecord,
    );

    const currentRating = titleRecord?.rating?.overall;

    function handleOpen(e: MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();

        setIsActive((v) => !v);

        if (!isActive) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        e.stopPropagation();

        const val = e.target.value;
        // допускаємо тільки числа та крапку
        if (/^[0-9]*\.?[0-9]*$/.test(val)) {
            setValue(val);
            setError("");
        }
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        e.stopPropagation();

        const num = parseFloat(value);
        if (isNaN(num) || num < 1 || num > 10) {
            setError("Value must be 0 - 10");
            setValue("");
            return;
        }

        rate(num);
        setIsActive(false);
        setValue("");
    }

    return (
        <>
            <li
                className={`border-b border-b-white/15 flex text-center px-2 w-full transition-all duration-150 ${isActive || currentRating ? "text-amber-300" : "text-white gap-2"}`}
            >
                <div
                    className={
                        isActive
                            ? "w-1/3 flex gap-0"
                            : "w-full flex gap-2 text-center justify-center transition-all duration-150"
                    }
                    onClick={handleOpen}
                >
                    <span className="flex items-center gap-0.5">
                        {currentRating && !isActive ? (
                            <>
                                <StarOutlinedIcon fontSize="small" />
                                <span className="[padding-top:0.15em]">{`${currentRating}`}</span>
                            </>
                        ) : (
                            <StarOutlineOutlinedIcon fontSize="small" />
                        )}
                    </span>

                    <span
                        className={
                            isActive
                                ? "ml-0 padding-top:0.15em] "
                                : "ml-1 [padding-top:0.15em]"
                        }
                    >
                        Rate
                    </span>
                </div>
                {isActive ? (
                    <form
                        onSubmit={handleSubmit}
                        className={"flex justify-end overflow-hidden w-2/3"}
                    >
                        :{/* must appear when form opens*/}
                        <input
                            name="rating"
                            type="text"
                            value={value}
                            min={1}
                            max={10}
                            onChange={handleChange}
                            onClick={(e) => e.stopPropagation()}
                            disabled={isAnyActionLoading}
                            ref={inputRef}
                            placeholder="1-10"
                            className="border-b-amber-300 border-b text-center w-4/6 outline-0"
                        />
                        <button
                            type="submit"
                            className="w-1/5 cursor-pointer hover:scale-105 text-amber-100"
                            disabled={isAnyActionLoading || !value}
                        >
                            <DoneOutlinedIcon
                                fontSize="small"
                                className="text-amber-300"
                            />
                        </button>
                    </form>
                ) : null}
            </li>
            {error ? (
                <div className="text-red-500 text-sm my-0 py-0.5 px-6 text-center hover:text-red-400">
                    {error}
                </div>
            ) : null}
        </>
    );
};

export default RateCardAction;

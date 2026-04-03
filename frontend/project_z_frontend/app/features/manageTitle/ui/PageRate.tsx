import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
    type MouseEvent,
} from "react";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import { StarRating } from "~/shared/ui/Rating";
import type { ManageTitleRecordProps } from "../model/manageTitleRecord";
import { useTitleRecordMutation } from "../hooks/useTitleRecordMutation";
import { Button } from "~/shared/ui/Button";
import ClearIcon from "@mui/icons-material/Clear";

const PageRate = ({ initialData, titleRecord }: ManageTitleRecordProps) => {
    const [value, setValue] = useState<string>("");
    const [error, setError] = useState<string>("");

    const inputRef = useRef<HTMLInputElement | null>(null);

    const { rate, isAnyActionLoading, clearRate } = useTitleRecordMutation(
        initialData.apiTitleId,
        initialData,
        titleRecord,
    );

    const currentRating = titleRecord?.rating?.overall;

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        e.stopPropagation();

        const val = e.target.value;
        // допускаємо тільки числа та крапку
        if (/^[0-9]*\.?[0-9]*$/.test(val)) {
            if (Number(val) <= 10) {
                setValue(val);
                setError("");
            }
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
        setValue("");
    }

    function handleClear() {
        clearRate();
        setValue("");
    }

    return (
        <div
            className={`border-y border-y-white/15 text-center w-full transition-all duration-150 text-md`}
        >
            <div className="w-full flex gap-2 text-center justify-center transition-all duration-150">
                <span className="ml-1 [padding-top:0.15em]">Your Rating</span>

                <span className="flex items-center gap-0.5 text-amber-400 ">
                    {currentRating && (
                        <>
                            <StarRoundedIcon fontSize="small" />
                            <span className="[padding-top:0.15em]">
                                {`${currentRating}`} / 10
                            </span>
                            <Button variant="text-only" onClick={handleClear}>
                                <ClearIcon
                                    fontSize="small"
                                    className="text-red-500  ml-2 hover:scale-120 hover:text-red-600"
                                />
                            </Button>
                        </>
                    )}
                </span>
            </div>

            <StarRating rating={+value || currentRating || 0} />

            <form
                onSubmit={handleSubmit}
                className={"flex justify-between overflow-hidden w-full"}
            >
                <input
                    name="rating"
                    type="text"
                    value={value}
                    min={1}
                    max={10}
                    onChange={handleChange}
                    onClick={(e) => e.stopPropagation()}
                    ref={inputRef}
                    placeholder="1-10"
                    className=" bg-gray-200 rounded-l-md text-center outline-0 w-full py-2"
                />
                <button
                    type="submit"
                    className="group px-4 bg-amber-400 cursor-pointer  text-amber-50  rounded-r-md duration-150"
                >
                    <DoneOutlinedIcon
                        fontSize="small"
                        className="group-hover:scale-120"
                    />
                </button>
            </form>
        </div>
    );
};

export default PageRate;

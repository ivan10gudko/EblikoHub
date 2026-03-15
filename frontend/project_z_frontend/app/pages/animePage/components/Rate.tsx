import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useRef, useState, type ChangeEvent, type FormEvent, type MouseEvent } from 'react';
import type { Title } from '~/store/watchlist.store';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import useWatched from '~/store/watched.store';
import StarRating from '../../../components/UI/StarRating';

interface Props{
    item: Title,
}
const Rate: React.FC<Props>=({item})=>{
    const [isActive,setIsActive] = useState<boolean>(false);
    const [value,setValue] = useState<string>('');
    const [error,setError] = useState<string>('');

    const inputRef = useRef<HTMLInputElement|null>(null);

    const title = useWatched(state => state.getTitleById(item.id));
    const {addTitle} = useWatched();

    function handleOpen(e: MouseEvent<HTMLDivElement>){
        e.preventDefault();
        e.stopPropagation();
        
        setIsActive(v=>!v);

        if(!isActive){
            setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
        }
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>){
        e.stopPropagation();
        
        const val = e.target.value;
        // допускаємо тільки числа та крапку
        if (/^[0-9]*\.?[0-9]*$/.test(val)){
            if(Number(val)<=10){
                setValue(val);
                setError('');
            }
        }
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        e.stopPropagation();
        
        const num = parseFloat(value);
        if (isNaN(num) || num < 1 || num > 10) {
            setError('Value must be 0 - 10');
            setValue('');
            return;
        }
        
        addTitle({...item,rating:num});
        setIsActive(false);
        setValue('');
        
    }


    return (
            <div className={`border-b border-b-white/15 text-center px-2 w-full transition-all duration-150 text-md`} >
                <div className={isActive?"w-1/3 flex gap-0":"w-full flex gap-2 text-center justify-center transition-all duration-150"} onClick={handleOpen}>
                    
                    <span className={isActive?"ml-0 padding-top:0.15em] ":"ml-1 [padding-top:0.15em]"}>
                        Your Rating
                    </span>

                    <span className='flex items-center gap-0.5 text-amber-400 '>
                        {title?.rating && !isActive ?
                            <>
                                <StarRoundedIcon fontSize="small" />
                                <span className='[padding-top:0.15em]'>{`${title?.rating }`} / 10</span>
                            </>
                        :
                            null
                        }
                    </span>
                </div>
                
                <StarRating rating={+value || title?.rating || 0} />
                
                <form onSubmit={handleSubmit} className={"flex justify-between overflow-hidden w-full"}>
                    <input
                        name='rating'
                        type='text'
                        value={value}
                        min={1}
                        max={10}
                        onChange={handleChange}
                        onClick={(e)=>e.stopPropagation()}
                        ref={inputRef}
                        placeholder='1-10'
                        className=' bg-gray-200 rounded-l-md text-center outline-0 w-full py-2'
                    />
                    <button type='submit' className='group px-4 bg-amber-400 cursor-pointer  text-amber-50  rounded-r-md duration-150'>
                        <DoneOutlinedIcon fontSize="small" className='group-hover:scale-120'/>
                    </button>
                </form>
            </div>
    )
}

export default Rate;
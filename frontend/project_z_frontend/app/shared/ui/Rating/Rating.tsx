import StarIcon from '@mui/icons-material/Star';

interface Props{
    children: number|null|undefined,
    className?: string;
}

const Rating: React.FC<Props> = ({children,className=""})=>{
    const styles ='flex gap-2 items-center '+ className;
    return (
        <span className={styles}>
            <StarIcon className='text-amber-300'/>
            <span className='pt-0.5'>{children ? children: "?"} / 10</span>
        </span>
    );
};

export default Rating;
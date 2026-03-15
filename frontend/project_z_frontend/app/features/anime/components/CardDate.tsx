import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface Props{
    children: string | React.ReactNode,
    className?: string;
}

const CardDate: React.FC<Props> = ({children,className=""})=>{
    const styles = 'flex py-1 gap-1 text-sm items-center text-center text-gray-800'+ className;
    return (<div className={styles}>
            <CalendarTodayIcon sx={{fontSize:16}}/>
            <div className='pt-0.5'>{children}</div>
        </div>);
}

export default CardDate;
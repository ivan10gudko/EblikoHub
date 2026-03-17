import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface Props{
    children: string | React.ReactNode,
    className?: string;
}

const Date: React.FC<Props> = ({children,className})=>{
    const styles = 'flex gap-2 items-center'+ className;
    return (<span className={styles}>
            <CalendarTodayIcon fontSize='small'/>
            <span>{children}</span>
        </span>);
}

export default Date;
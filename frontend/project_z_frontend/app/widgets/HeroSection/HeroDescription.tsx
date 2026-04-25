import { Link } from "react-router";

interface Props{
    children: string
    id:number
}

const HeroDescription: React.FC<Props> = ({children,id})=>{
    const text = children.slice(0,240);
    return (<span className='w-fit line-clamp-3 lg:line-clamp-none'>
            {text} <Link to={`/anime/${id}`} className="text-secondary hover:text-secondary-hover">...Read more</Link>
        </span>);
};

export default HeroDescription;

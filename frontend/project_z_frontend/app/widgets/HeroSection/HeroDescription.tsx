import { Link } from "react-router";

interface Props{
    children: string
    id:number
}

const HeroDescription: React.FC<Props> = ({children,id})=>{
    const text = children.slice(0,240);
    return (<span className='w-fit'>
            {text} <Link to={`/anime/${id}`} className="text-blue-600 hover:text-blue-400">...Read more</Link>
        </span>);
};

export default HeroDescription;

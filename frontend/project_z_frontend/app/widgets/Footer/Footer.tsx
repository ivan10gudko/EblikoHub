import { Link } from "react-router";
import { Logo } from "../../shared/ui/Logo";

const Footer : React.FC<{}> = ()=>{
    return (
    <footer className="w-full flex items-center justify-center flex-col gap-4 py-16 bg-gray-300 text-gray-600">
        <Logo />
        <div className="text-lg ">Your ultimate destination for anime discovery and ratings</div>
        <ul className="list-none flex justify-center gap-4 *:cursor-pointer">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/contact">Contact</Link></li>
        </ul>
    </footer>
    )
}
export default Footer;
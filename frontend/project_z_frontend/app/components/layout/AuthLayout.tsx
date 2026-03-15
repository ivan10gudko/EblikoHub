import { Link, Outlet } from "react-router";
import Logo from "~/components/UI/Logo";

const AuthLayout : React.FC = ()=> {
    return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[url(/placeholder.jpg)]">
        <div className="absolute top-4 left-8"><Link to="/"><Logo /></Link></div>
        <Outlet />
    </div> );
}

export default AuthLayout;
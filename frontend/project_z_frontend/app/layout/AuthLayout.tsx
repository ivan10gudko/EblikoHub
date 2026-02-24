import { useState } from "react";
import { Link, Outlet } from "react-router";
import ConfirmEmail from "~/components/AuthPage/ConfirmEmail";
import LoginForm from "~/pages/Login";
import SignupForm from "~/pages/Signup";
import Logo from "~/components/Logo";

const AuthLayout : React.FC = ()=> {
    return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[url(/placeholder.jpg)]">
        <div className="absolute top-4 left-8"><Link to="/"><Logo /></Link></div>
        <Outlet />
    </div> );
}

export default AuthLayout;
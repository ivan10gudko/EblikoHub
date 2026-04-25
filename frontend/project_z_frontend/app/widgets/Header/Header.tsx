import { NavLink, useNavigate, useNavigation } from "react-router";
import { useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BurgerIcon from "../../shared/ui/Burger/BurgerIcon";

import { Logo } from "~/shared/ui/Logo";
import { SearchBar } from "~/features/search";
import { useAuthStore } from "~/features/auth";
import { ThemeToggle } from "~/features/theme/ui/ThemeToggle";


const Header = () => {
    const { isAuth, userId } = useAuthStore();
    const [burgerMenuOpen, setBurgerMenuOpen] = useState<boolean>(false);

    const navigate = useNavigate();
    const navigation = useNavigation();
    const isNavigating = navigation.state === "loading";
    const handleMainSearch = (query: string) => {
        navigate(`/search?query=${encodeURIComponent(query)}`);
    };
    const watchlistPath = isAuth && userId ? `/watchlist/${userId}` : "/auth/login";
    const burgerMenuStyles = useMemo(() => burgerMenuOpen ? "border-t-1 bg-card  backdrop-blur-sm absolute top-17 w-full left-0 h-full clip flex justify-center pt-4 text-foreground z-1000" : "hidden", [burgerMenuOpen]);

    return (
        <header className="py-4 px-6 *:text-sm *:md:text-md md:px-14 w-full border-b flex justify-between items-center">
            <NavLink to="/">
                <Logo />
            </NavLink>

            <div className="hidden sm:flex gap-4 items-center">
                <ThemeToggle/>
                <SearchBar isLoading={isNavigating} onSearch={handleMainSearch} className="w-56" />
                <NavLink to={"/rooms"} className={({ isActive, isPending }) => (
                    isActive ? "text-primary border-b font-bold " :
                        isPending ? "text-primary-hover font-bold " :
                            ""
                )} >Rooms</NavLink>
                <NavLink to={watchlistPath}>Watchlist</NavLink>
                {isAuth ? (
                    <NavLink to="/profile">
                        <AccountCircleIcon fontSize="large" />
                    </NavLink>
                ) : (
                    <NavLink to="auth/signup" className="bg-primary py-2 px-3 rounded-lg">Sign up</NavLink>
                )}
            </div>

            <div className="flex sm:hidden gap-1 items-center">

                <NavLink to="search">
                    <SearchIcon fontSize="large" />
                </NavLink>

                {isAuth ? (
                    <NavLink to="profile">
                        <AccountCircleIcon fontSize="large" />
                    </NavLink>
                ) : (
                    <NavLink to="auth" className="bg-primary py-2 px-2 md:px-3 rounded-lg">Sign in</NavLink>
                )}
                <BurgerIcon onClick={() => setBurgerMenuOpen(v => !v)} isOpen={burgerMenuOpen} />

            </div>
            <div className={burgerMenuStyles} onClick={() => setBurgerMenuOpen(false)}>
                <ul className=" text-lg flex flex-col *:hover:backdrop-hue-rotate-15 *:hover:scale-y-105 w-full *:flex *:justify-center *:py-3">
                    <li><NavLink to={"/rooms"}>Popular</NavLink></li>
                    <li><NavLink to={"/rooms"}>Rooms</NavLink></li>
                    <li><NavLink to={watchlistPath}>Watchlist</NavLink></li>
                    <li >{isAuth ? (
                        <NavLink to="profile"> Profile </NavLink>
                    ) : (
                        <NavLink to="auth" className="bg-primary py-2 px-3 rounded-lg">Sign in</NavLink>
                    )}</li>
                </ul>
            </div>
        </header>
    );
}

export default Header;

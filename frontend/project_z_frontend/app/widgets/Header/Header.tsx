import { NavLink, useNavigate, useNavigation } from "react-router";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WhatshotIcon from '@mui/icons-material/Whatshot';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PersonIcon from '@mui/icons-material/Person';

import BurgerIcon from "../../shared/ui/Burger/BurgerIcon";
import { Logo, LogoImg } from "~/shared/ui/Logo";
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
    const burgerLinkStyle = "flex items-center gap-4 w-full p-4 rounded-2xl bg-background-muted border border-border/50 hover:bg-primary-hover hover:border-primary/50 hover:scale-[1.02] transition-all duration-200 active:scale-95 group";

    return (
        <header className="py-4 px-6 md:px-14 lg:px-24 w-full border-b flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-[1000]">
            <NavLink to="/" className="flex items-center gap-2">
                <LogoImg className="text-primary w-10 h-10" />
                <span className="hidden md:block">
                    <Logo />
                </span>
            </NavLink>

            <div className="flex items-center gap-4">
                <ThemeToggle />

                <nav className="hidden sm:flex gap-6 items-center">
                    <SearchBar isLoading={isNavigating} onSearch={handleMainSearch} className="w-56" />
                    <NavLink to="/rooms" className={({ isActive }) => isActive ? "text-primary font-bold" : "hover:text-primary transition-colors"}>Rooms</NavLink>
                    <NavLink to={watchlistPath} className="hover:text-primary transition-colors">Watchlist</NavLink>
                    {isAuth ? (
                        <NavLink to="/profile">
                            <AccountCircleIcon fontSize="large" className="text-foreground/80 hover:text-primary transition-colors" />
                        </NavLink>
                    ) : (
                        <NavLink to="auth/signup" className="bg-primary text-primary-foreground py-2 px-4 rounded-xl font-bold hover:brightness-110 transition-all">Sign up</NavLink>
                    )}
                </nav>

                <div className="flex sm:hidden gap-3 items-center">
                    <NavLink to="search">
                        <SearchIcon fontSize="medium" className="text-foreground/70" />
                    </NavLink>
                    <BurgerIcon onClick={() => setBurgerMenuOpen(v => !v)} isOpen={burgerMenuOpen} />
                </div>

                <div
                    className={`fixed w-full h-screen inset-0 top-[73px] bg-card/60 backdrop-blur-xl z-[999] transition-all duration-300 flex justify-center p-6 ${burgerMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-4"
                        }`}
                    onClick={() => setBurgerMenuOpen(false)}
                >
                    <nav
                        className="w-full max-w-sm flex flex-col gap-3"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <NavLink to="/rooms" onClick={() => setBurgerMenuOpen(false)} className={burgerLinkStyle}>
                            <WhatshotIcon className="text-secondary group-hover:animate-pulse" />
                            <span className="font-semibold text-lg text-foreground">Popular</span>
                        </NavLink>

                        <NavLink to="/rooms" onClick={() => setBurgerMenuOpen(false)} className={burgerLinkStyle}>
                            <MeetingRoomIcon className="text-secondary" />
                            <span className="font-semibold text-lg text-foreground">Rooms</span>
                        </NavLink>

                        <NavLink to={watchlistPath} onClick={() => setBurgerMenuOpen(false)} className={burgerLinkStyle}>
                            <FormatListBulletedIcon className="text-secondary" />
                            <span className="font-semibold text-lg text-foreground">Watchlist</span>
                        </NavLink>

                        <div className="pb-10">
                            {isAuth ? (
                                <NavLink to="/profile" onClick={() => setBurgerMenuOpen(false)} className={burgerLinkStyle}>
                                    <PersonIcon className="text-secondary" />
                                    <span className="font-semibold text-lg text-foreground">Profile Settings</span>
                                </NavLink>
                            ) : (
                                <NavLink to="auth" onClick={() => setBurgerMenuOpen(false)} className="flex justify-center w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-xl shadow-lg shadow-primary/20">
                                    Sign In
                                </NavLink>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;
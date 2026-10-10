import { NavLink, useNavigate, useNavigation } from "react-router";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PersonIcon from "@mui/icons-material/Person";

import BurgerIcon from "../../shared/ui/Burger/BurgerIcon";
import { Logo, LogoImg } from "~/shared/ui/Logo";
import SearchBar from "~/shared/ui/SearchBar";
import { useAuthStore } from "~/features/auth";
import { ThemeToggle } from "~/features/theme/ui/ThemeToggle";
import { useUser } from "~/entities/user";
import { HeaderAvatar } from "./HeadAvatar";
interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  showInDesktop: boolean;
}

const getNavConfig = (isAuth: boolean, userId: string | null): NavItem[] => [
  {
    to: "/",
    label: "Popular",
    icon: WhatshotIcon,
    showInDesktop: false,
  },
  {
    to: `/rooms/user/${userId || ""}`,
    label: "Rooms",
    icon: MeetingRoomIcon,
    showInDesktop: true,
  },
  {
    to: isAuth && userId ? `/watchlist/${userId}` : "/auth/login",
    label: "Watchlist",
    icon: FormatListBulletedIcon,
    showInDesktop: true,
  },
  {
    to: `/profile/${userId || ""}`,
    label: "Profile Settings",
    icon: PersonIcon,
    showInDesktop: false,
  },
];

const Header = () => {
  const { isAuth, userId } = useAuthStore();
  const [burgerMenuOpen, setBurgerMenuOpen] = useState<boolean>(false);
  const { data: profile } = useUser(userId);
  const navigate = useNavigate();
  const navigation = useNavigation();

  const handleMainSearch = (query: string) => {
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  const isSearchLoading =
    navigation.state === "loading" &&
    navigation.location?.pathname === "/search";

  const navItems = getNavConfig(isAuth, userId);

  const burgerLinkStyle =
    "flex items-center gap-4 w-full p-4 rounded-2xl bg-background-muted border border-border/50 hover:border-primary/50 hover:scale-[1.02] transition-all duration-200 active:scale-95 group";

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
          <SearchBar
            isLoading={isSearchLoading}
            onSearch={handleMainSearch}
            className="w-56"
          />

          {navItems
            .filter((item) => item.showInDesktop)
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? "text-primary font-bold"
                    : "hover:text-primary transition-colors"
                }
              >
                {item.label}
              </NavLink>
            ))}

          {isAuth ? (
            <NavLink to={`/profile/${userId}`}>
              <HeaderAvatar
                src={profile?.img}
                name={profile?.name || "User"}
                className="w-10 h-10"
              />
            </NavLink>
          ) : (
            <NavLink
              to="auth/signup"
              className="bg-primary text-primary-foreground py-2 px-4 rounded-xl font-bold hover:brightness-110 transition-all"
            >
              Sign up
            </NavLink>
          )}
        </nav>

        <div className="flex sm:hidden gap-3 items-center">
          <NavLink to="search">
            <SearchIcon fontSize="medium" className="text-foreground/70" />
          </NavLink>
          <BurgerIcon
            onClick={() => setBurgerMenuOpen((v) => !v)}
            isOpen={burgerMenuOpen}
          />
        </div>

        <div
          className={`fixed w-full h-screen inset-0 top-[73px] bg-card/60 backdrop-blur-xl z-[999] transition-all duration-300 flex justify-center p-6 ${burgerMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none translate-y-4"
            }`}
          onClick={() => setBurgerMenuOpen(false)}
        >
          <nav
            className="w-full max-w-sm flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems
              .filter((item) => item.label !== "Profile Settings" || isAuth)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setBurgerMenuOpen(false)}
                    className={burgerLinkStyle}
                  >
                    <Icon className="text-primary group-hover:animate-pulse" />
                    <span className="font-semibold text-lg text-foreground">
                      {item.label}
                    </span>
                  </NavLink>
                );
              })}

            {!isAuth && (
              <div className="pb-10">
                <NavLink
                  to="auth"
                  onClick={() => setBurgerMenuOpen(false)}
                  className="flex justify-center w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-xl shadow-lg shadow-primary/20"
                >
                  Sign In
                </NavLink>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
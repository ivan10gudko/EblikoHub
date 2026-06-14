import { Button } from "~/shared/ui/Button";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useEffect } from "react";
import { useThemeStore } from "../store/theme.store";
interface ThemeToggleProps {
  label: boolean;
}
export const ThemeToggle = ({ label = false }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <Button
      variant="text-only"
      onClick={toggleTheme}
      className={`p-2 rounded-xl hover:bg-primary/5 transition-colors flex items-center hover:no-underline ${
        label ? "gap-2" : "justify-center"
      }`}
      title={theme === "light" ? "Switch to Dark" : "Switch to Light"}
    >
      {theme === "light" ? (
        <>
          {label && <span className="leading-none mt-1">Dark Mode</span>}
          <DarkModeIcon className="text-foreground" />
        </>
      ) : (
        <>
          {label && <span className="leading-none mt-1">Light Mode</span>}
          <LightModeIcon className="text-primary" />
        </>
      )}
    </Button>
  );
};

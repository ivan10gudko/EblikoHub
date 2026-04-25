
import { Button } from "~/shared/ui/Button";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useEffect } from "react";
import { useThemeStore } from "../store/theme.store";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <Button
      variant="text-only"
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-background-muted transition-colors"
      title={theme === 'light' ? "Switch to Dark" : "Switch to Light"}
    >
      {theme === 'light' ? (
        <DarkModeIcon className="text-foreground" />
      ) : (
        <LightModeIcon className="text-primary" />
      )}
    </Button>
  );
};
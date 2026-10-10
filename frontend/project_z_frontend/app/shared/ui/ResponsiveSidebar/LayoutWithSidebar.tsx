import { useState, type ReactNode, isValidElement, cloneElement } from "react";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

interface ResponsiveSidebarProps {
    sidebar: ReactNode;
    children: ReactNode;
    menuButtonLabel?: string;
    className?: string;
}

export const LayoutWithSidebar = ({
    sidebar,
    children,
    menuButtonLabel = "Navigation",
    className = "",
}: ResponsiveSidebarProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const handleClose = () => setIsMobileMenuOpen(false);

    const renderSidebar = () => {
        if (isValidElement(sidebar)) {
            return cloneElement(sidebar as React.ReactElement<{ onCloseMobileMenu?: () => void }>, {
                onCloseMobileMenu: handleClose,
            });
        }
        return sidebar;
    };

    return (
        <div className={`relative flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6 max-w-[1400px] mx-auto min-h-[calc(100vh-64px)] bg-background-muted/30 w-full overflow-x-hidden ${className}`}>
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={handleClose}
                />
            )}

            <div className={`
        fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[320px] p-4 bg-card border-r border-border shadow-2xl
        transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300 ease-in-out overflow-y-auto
        lg:relative lg:inset-auto lg:translate-x-0 lg:transform-none lg:transition-none lg:h-auto lg:w-80 lg:p-0 lg:bg-transparent lg:border-none lg:shadow-none lg:z-0
      `}>
                {renderSidebar()}
            </div>

            <main className="flex-1 w-full flex flex-col pt-2 min-w-0">
                <div className="lg:hidden flex items-center justify-between mb-4 bg-card border border-border p-3 rounded-xl shadow-md">
                    <span className="text-sm font-bold text-foreground">{menuButtonLabel}</span>
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/30 active:scale-95 transition-all text-xs font-semibold cursor-pointer hover:bg-primary/20"
                    >
                        <MenuOpenIcon sx={{ fontSize: 16 }} />
                        <span>Open Menu</span>
                    </button>
                </div>

                <div className="w-full">
                    {children}
                </div>
            </main>
        </div>
    );
};
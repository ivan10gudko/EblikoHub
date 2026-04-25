import type { ReactNode } from "react";

interface SidebarProps{
    children:ReactNode;
    className?:string;
}
export const Sidebar = ({children,className}:SidebarProps) => {
    return(
        <aside className={`rounded-2xl divide-y text-md md:text-sm border-border border shadow min-w-3xs ${className || ""}`} >
            {children}
        </aside>
    )
}
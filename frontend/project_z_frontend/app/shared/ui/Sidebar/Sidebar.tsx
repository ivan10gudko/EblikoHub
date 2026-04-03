import type { ReactNode } from "react";

interface SidebarProps{
    children:ReactNode;
}
export const Sidebar = ({children}:SidebarProps) => {
    return(
        <aside className=" rounded-2xl divide-y text-md md:text-sm " >
            {children}
        </aside>
    )
}
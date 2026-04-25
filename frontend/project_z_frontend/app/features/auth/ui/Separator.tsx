import type { ReactNode } from "react";

interface Props{
    children: ReactNode | string;
}

const Separator: React.FC<Props> = ({children="or"})=>{
    return(
            <div className="flex items-center justify-center my-4">
            <div className="h-[1px] bg-background-muted w-full"></div>
            <span className='block text-sm px-4 text-background-muted'> {children} </span>
            <div className="h-[1px] bg-background-muted w-full"></div>
        </div>
    )

}

export default Separator;
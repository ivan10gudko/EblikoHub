import type { ReactNode } from "react";

interface Props{
    children: ReactNode | string;
}

const Separator: React.FC<Props> = ({children="or"})=>{
    return(
            <div className="flex items-center justify-center my-4">
            <div className="h-[1px] bg-slate-500 w-full"></div>
            <span className='block text-sm px-4 text-slate-500'> {children} </span>
            <div className="h-[1px] bg-slate-500 w-full"></div>
        </div>
    )

}

export default Separator;
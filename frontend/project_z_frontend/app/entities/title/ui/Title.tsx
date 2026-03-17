import type React from "react";
interface Props{
    children:React.ReactNode,
    originalTitle?:string
}
const Title :React.FC<Props>  = ({children , originalTitle})=> {
    return (
    <div>
        <h1 className="text-2xl my-1 ">
            {children}
        </h1>
        {
        originalTitle &&
            <h5 className="text-xs text-black/60">
                {originalTitle}
            </h5>
        }
    </div>

    );
}

export default Title;
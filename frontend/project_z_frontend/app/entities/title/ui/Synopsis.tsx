import type React from "react";

interface Props{
    synopsis: string | null | undefined;
}
const Synopsis :React.FC<Props>  = ({synopsis}) => {
    if( synopsis){
        return(
        <div className="my-4" >
            <h4 className="font-normal text-lg mb-2">Synopsis</h4>
            <p className="border-t border-t-black/30  py-3">
                {synopsis.replace("[Written by MAL Rewrite]","")}
            </p>
        </div>)
    }
    return null
}
export default Synopsis;
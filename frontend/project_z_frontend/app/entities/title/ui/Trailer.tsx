import type React from "react";

interface Props{
    url: string | null | undefined;
}
const Trailer :React.FC<Props>  = ({url}) => {
    if(url){
        return(
        <div className="my-4 " >
            <h4 className="font-normal text-lg mb-2">Trailer</h4>
            <div className="py-4 flex items-center justify-center">
            <iframe className="w-4/5 aspect-video" src={url} allowFullScreen></iframe>
            </div>
        </div>)
    }
    return null
}
export default Trailer;
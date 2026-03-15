import ButtonSkeleton from "../../../components/UI/ButtonSkeleton";

const MainComponentSkeleton : React.FC = () => {
    const baseClass = "animate-pulse bg-gray-300 cursor-default pointer-events-none rounded"

    return (
    <div className="w-full font-light">
        <div className={baseClass + " w-24 h-10 mb-2"}></div>
        <div className={baseClass + " w-24 h-4 mb-6"}></div>
        <div className="flex my-4 gap-5">
        {Array.from({length:4},()=>null).map((v,i)=><div className={baseClass+" w-18 h-6"}></div>)}
        </div>
        <div className="flex my-4 gap-5">
            {Array.from({length:4},()=>null).map((v,i)=><div className={baseClass+" w-12 h-4 rounded-lg"}></div>)}
        </div>
        <div className={baseClass + " w-full h-3 mb-2"}></div>
        <div className={baseClass + " w-full h-3 mb-2"}></div>
        <div className={baseClass + " w-full h-3 mb-2"}></div>
        <div className={baseClass + " w-full h-3 mb-6"}></div>
        <div className="py-4 flex items-center justify-center">
            <div className={baseClass+" w-4/5 aspect-video"}></div>
        </div>
    </div>
    );
}

export default MainComponentSkeleton ;
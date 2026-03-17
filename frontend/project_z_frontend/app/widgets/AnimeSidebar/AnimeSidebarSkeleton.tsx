import ButtonSkeleton from "../../shared/ui/Button/ButtonSkeleton";

const AnimeSidebarSkeleton : React.FC = () => {

    return (
        
            <aside className=" w-1/3 rounded-2xl divide-y text-md md:text-sm " >
                <div className="w-full relative aspect-[3/4] overflow-hidden rounded-t-xl animate-pulse">
                    <div className="w-full h-full object-cover duration-300 animate-pulse bg-gray-300 cursor-default pointer-events-none"></div>
                </div>
                <div className="w-full py-8 flex flex-col gap-4 border rounded-b-xl px-4 border-gray-200 shadow divide-y divide-gray-200">
                    <div className="flex flex-col gap-4 py-2">
                        <div className=""></div>
                            <ButtonSkeleton className="w-full"/>
                            <ButtonSkeleton className="w-full"/>
                    </div>

                    <ButtonSkeleton className="w-full"/>

                </div>
            </aside>
    );
}

export default AnimeSidebarSkeleton ;
function Loader() {
    return ( <div className="w-full bg-black/80 min-h-20 flex justify-center items-center py-20">
        <div className="bg-white relative w-40 h-40 animate-spin [animation-duration:2s]">
            <div className="bg-black/80 w-16 h-16 absolute top-0 left-4 "></div>
            <div className="bg-black/80 w-16 h-16 absolute top-4 left-24"></div>
            <div className="bg-black/80 w-16 h-16 absolute top-24 right-4"></div>
            <div className="bg-black/80 w-16 h-16 absolute top-20 left-0"></div>
        </div>
    </div> );
}

export default Loader;
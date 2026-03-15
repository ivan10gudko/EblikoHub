import { create } from 'zustand'

export type Title = {
    id:number,
    img:string,
    title:string,
    
}

type Watchlist = {
    watchlist: Title[],
    addTitle: (item:Title)=>void,
    removeTitle: (item:Title)=>void,
}

const useWatchlist = create<Watchlist>()((set) => ({
    watchlist:[],
    addTitle:(item:Title)=>{
        set((state)=>{
            if(state.watchlist.some(v=>v.id === item.id)) return state;
            
            return {
                watchlist: [...state.watchlist , item],
            }
        });
    },
    removeTitle:(item:Title)=>{
        set((state)=>{
            return {
                watchlist: state.watchlist.filter(v =>v.id != item.id)
            }
        });
    },
    
}))

export default useWatchlist;
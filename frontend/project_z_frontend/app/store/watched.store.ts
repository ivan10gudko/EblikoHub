import { create } from 'zustand'

export type Title = {
    id:number,
    img:string,
    title:string,
    rating:number|null,
}

type Watchedlist = {
    watched: Title[],
    addTitle: (item:Title)=>void,
    removeTitle: (item:Title)=>void,
    rateTitle: (id:number,rating:number)=>void,
    getTitleById: (id: number) => Title | undefined
}

const useWatched = create<Watchedlist>()((set,get) => ({
    watched:[],
    
    addTitle: (item: Title) => {
        set((state) => {
            const exists = state.watched.some((v) => v.id === item.id)
            
            if (exists) {
                return {
                    watched: state.watched.map((v) =>
                        v.id === item.id &&
                        (v.rating !== item.rating || v.img !== item.img || v.title !== item.title)
                        ? item
                        : v
                    ),
                    }
                }
                return { watched: [...state.watched, item] }
        })
    },
    removeTitle:(item:Title)=>{
        set((state)=>{
            return {
                watched: state.watched.filter(v =>v.id != item.id)
            }
        });
    },
    rateTitle:(id:number,rating:number)=>{
        set((state)=>{
            return {
                watched: state.watched.map(v => v.id === id && v.rating !== rating ? {...v,rating:rating} : v)
            }
        });
    },
    getTitleById: (id) => {
        return get().watched.find((v) => v.id === id)
    },
}))

export default useWatched;
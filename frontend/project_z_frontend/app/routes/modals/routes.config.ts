import { pickModals, type ModalRouteDef } from "../../shared/helpers"; //direct import because of react router loading specifics


const titleModals = {
    add: { path: "add", file: "./routes/modals/title.add.tsx" },
    edit: { path: "edit/:titleId", file: "./routes/modals/title.edit.tsx" },
    view: { path: "view/:titleId", file: "./routes/modals/title.view.tsx" },
    rating: { path: "rating/:titleId", file: "./routes/modals/title.rating.tsx" },
    seasons: { path: "seasons/:titleId", file: "./routes/modals/title.seasons.tsx" },
} satisfies Record<string, ModalRouteDef>;

const roomTitleModals = {
    add: { path: "add", file: "./routes/modals/room.title.add.tsx" },
    edit: { path: "edit/:titleId", file: "./routes/modals/room.title.edit.tsx" },
    links: { path: "links/:titleId", file: "./routes/modals/room.title.links.tsx" },
} satisfies Record<string, ModalRouteDef>;

const adminModals = {
    banDetails: { path: "bans/:banId", file: "./routes/modals/room.ban.details.tsx" },
} satisfies Record<string, ModalRouteDef>;

export const titleModalRoutes = (prefixName: string, keys?: (keyof typeof titleModals)[]) =>
    pickModals(titleModals, prefixName, keys);

export const roomTitleModalRoutes = (prefixName: string, keys?: (keyof typeof roomTitleModals)[]) =>
    pickModals(roomTitleModals, prefixName, keys);

export const adminModalRoutes = (prefixName: string, keys?: (keyof typeof adminModals)[]) =>
    pickModals(adminModals, prefixName, keys);

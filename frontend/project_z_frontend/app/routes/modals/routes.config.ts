import { route } from "@react-router/dev/routes";
import { pickModals, type ModalRouteDef } from "../../shared/helpers"; //direct import because of react router loading specifics

const titleModals = {
    add: { path: "add", file: "./routes/modals/title.add.tsx" },
    edit: { path: "edit/:titleId", file: "./routes/modals/title.edit.tsx" },
    view: { path: "view/:titleId", file: "./routes/modals/title.view.tsx" },
    rating: { path: "rating/:titleId", file: "./routes/modals/title.rating.tsx" },
    seasons: { path: "seasons/:titleId", file: "./routes/modals/seasons/seasons.tsx" },
} satisfies Record<string, ModalRouteDef>;

const seasonModals = {
    add: { path: "add", file: "./routes/modals/seasons/season.add.tsx" },
    edit: { path: "edit/:seasonId", file: "./routes/modals/seasons/season.edit.tsx" },
    view: { path: "view/:seasonId", file: "./routes/modals/seasons/season.view.tsx" },
} satisfies Record<string, ModalRouteDef>;

const roomTitleModals = {
    add: { path: "add", file: "./routes/modals/room.title.add.tsx" },
    edit: { path: "edit/:roomTitleId", file: "./routes/modals/room.title.edit.tsx" },
    links: { path: "links/:roomTitleId", file: "./routes/modals/room.title.links.tsx" },
    detailsLinks: { path: "detailsLinks/:roomTitleId", file: "./routes/modals/room.title.details.links.tsx" },
} satisfies Record<string, ModalRouteDef>;

const adminModals = {
    banDetails: { path: "bans/:banId", file: "./routes/modals/room.ban.details.tsx" },
} satisfies Record<string, ModalRouteDef>;

export const titleModalRoutes = (prefixName: string, keys?: (keyof typeof titleModals)[]) => {
    const baseModals = pickModals(titleModals, prefixName, keys);

    return baseModals.map((r) => {
        if (r.path?.startsWith("seasons/")) {
            const nestedSeasonRoutes = pickModals(seasonModals, `${prefixName}-season`);
            return route(r.path, r.file, { id: `${prefixName}-seasons` }, nestedSeasonRoutes);
        }
        return r;
    });
};

export const seasonModalRoutes = (prefixName: string, keys?: (keyof typeof seasonModals)[]) =>
    pickModals(seasonModals, prefixName, keys);

export const roomTitleModalRoutes = (prefixName: string, keys?: (keyof typeof roomTitleModals)[]) =>
    pickModals(roomTitleModals, prefixName, keys);

export const adminModalRoutes = (prefixName: string, keys?: (keyof typeof adminModals)[]) =>
    pickModals(adminModals, prefixName, keys);

export const roomMainModalRoutes = (prefixName: string) => {
    const parent = roomTitleModals.detailsLinks;

    const nestedTitleModals = pickModals(titleModals, `${prefixName}-nested`, ["view", "rating", "seasons"]);

    const flatTitleModals = pickModals(titleModals, prefixName, ["view", "rating", "seasons"]);

    return [
        route(parent.path, parent.file, { id: `${prefixName}-detailsLinks` }, nestedTitleModals),
        ...flatTitleModals,
    ];
};
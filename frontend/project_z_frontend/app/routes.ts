import {
    type RouteConfig,
    route,
    index,
    layout,
    prefix,
} from "@react-router/dev/routes";
import { adminModalRoutes, roomTitleModalRoutes, titleModalRoutes } from "./routes/modals/routes.config";

export default [
    layout("./routes/_main.tsx", [

        index("./routes/home.tsx"),

        route("about", "./routes/about.tsx"),
        route("contact", "./routes/contact.tsx"),

        route("privacy", "./routes/privacy.tsx"),

        route("watchlist/:userId", "./routes/watchlist/index.$userId.tsx", titleModalRoutes("watchlist")),

        route("profile/:userId/friends", "./routes/friends/friends.tsx", [
            index("./routes/friends/friends.index.tsx"),
            route("add", "./routes/friends/friends.add.tsx"),
            route("pending", "./routes/friends/friends.pending.tsx"),
            route("sent", "./routes/friends/friends.sent.tsx"),
        ]),

        layout("./routes/_protected.tsx", [

            route("profile", "./routes/_profile.tsx", [
                index("./routes/profile._index.tsx"),
                route(":userId", "./routes/profile.$userId.tsx"),

                route(":userId/settings", "./routes/profile._settings.tsx", [
                    index("./routes/profile.settings._index.tsx"),
                    route("change-password", "./routes/profile.settings.change-password.tsx"),
                ]),
            ]),

            ...prefix("rooms", [
                route("user/:userId", "./routes/rooms._index.tsx", [
                    route("add", "./routes/modals/room.add.tsx", { id: "rooms-add" }),
                ]),

                route("/requests", "./routes/roomRequestsLayouts/room.user.requests.tsx", [
                    index("./routes/roomRequestsLayouts/room.user.requests.add.tsx"),
                    route("invites", "./routes/roomRequestsLayouts/room.user.requests.invites.tsx"),
                    route("sent", "./routes/roomRequestsLayouts/room.user.requests.sent.tsx"),
                ]),

                route(":id", "./routes/roomDetailsLayouts/room.details.main.tsx", roomTitleModalRoutes("room-main")),

                route(":id/settings", "./routes/room/room.settings.index.tsx", [
                    index("./routes/room/room.settings._redirect.tsx"),
                    route("general", "./routes/room/room.settings.general.tsx", { id: "room-settings-general-alias" }),

                    ...prefix("titles", [
                        route("/", "./routes/room/titles/room.settings.titles.roomTitles.tsx", roomTitleModalRoutes("room-settings-titles")),
                        route("titleLinks", "./routes/room/titles/room.settings.titles.titleLinks.tsx"),
                        route("ai-matcher", "./routes/room/titles/room.settings.titles.aiMatcher.tsx"),
                    ]),

                    route("invites", "./routes/room/room.settings.requests.tsx", [
                        index("./routes/room/requests/room.settings.requests.find.tsx"),
                        route("requests", "./routes/room/requests/room.settings.requests.requests.tsx"),
                        route("sent", "./routes/room/requests/room.settings.requests.sent.tsx"),
                    ]),

                    route("members", "./routes/room/room.settings.members.tsx"),
                    route("admin", "./routes/room/room.settings.admin.tsx", adminModalRoutes("room-settings-admin")),
                ]),
            ]),
        ]),

        route("search", "./routes/search.tsx"),

        route("anime/:id", "./routes/anime.$id.tsx", titleModalRoutes("anime", ["edit", "view", "rating", "seasons"])),
    ]),

    route("auth", "./routes/_auth.tsx", [
        index("./routes/auth._index.tsx"),
        route("login", "./routes/auth.login.tsx"),
        route("signup", "./routes/auth.signup.tsx"),
        route("callback", "./routes/auth.callback.tsx"),
        route("reset-password", "./routes/auth.resetpassword.tsx"),
        route("forgot-password", "./routes/auth.forgotpassword.tsx"),
        route("login/reset-password/sent", "./routes/auth.resetpasswordsent.tsx"),
    ]),
] satisfies RouteConfig;
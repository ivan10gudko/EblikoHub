import {
    type RouteConfig,
    route,
    index,
    layout,
    prefix,
} from "@react-router/dev/routes";

export default [
    layout("./routes/_main.tsx", [

        index("./routes/home.tsx"),
        route("watchlist/:userId", "./routes/watchlist.$userId.tsx"),

        route("profile/:userId/friends", "./routes/friends/friends.tsx", [
            index("./routes/friends/friends.index.tsx"),
            route("add", "./routes/friends/friends.add.tsx"),
            route("pending", "./routes/friends/friends.pending.tsx"),
            route("sent", "./routes/friends/friends.sent.tsx"),
        ]),

        layout("./routes/_protected.tsx", [

            route("profile", "./routes/_profile.tsx", [
                index("./routes/profile._index.tsx"),
                route(":userId/settings", "./routes/profile.settings.tsx"),
                route(":userId", "./routes/profile.$userId.tsx"),
            ]),
            ...prefix("rooms", [
                route(":userId", "./routes/rooms._index.tsx"),     // /rooms
                route(":userId/:id", "./routes/rooms.$id.tsx"), // /rooms/:id
            ]),
        ]),

        route("search", "./routes/search.tsx"),

        route("anime/:id", "./routes/anime.$id.tsx"),
    ]),

    route("auth", "./routes/_auth.tsx", [
        index("./routes/auth._index.tsx"),
        route("login", "./routes/auth.login.tsx"),
        route("signup", "./routes/auth.signup.tsx"),
        route("callback", "./routes/auth.callback.tsx"),
        route("reset-password", "./routes/auth.resetpassword.tsx"),
        route("login/reset-password/sent", "./routes/auth.resetpasswordsent.tsx"),
    ]),
] satisfies RouteConfig;

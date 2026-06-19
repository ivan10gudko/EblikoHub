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
        
        layout("./routes/friends/friends.tsx", [
            route("user/:userId/friends", "./routes/friends/friends.index.tsx"),
            route("user/:userId/friends/add", "./routes/friends/friends.add.tsx"),
            route("user/:userId/friends/pending", "./routes/friends/friends.pending.tsx"),
            route("user/:userId/friends/sent", "./routes/friends/friends.sent.tsx"),
        ]),

        layout("./routes/_protected.tsx", [
            route("profile/:userId", "./routes/profile.tsx"),

            ...prefix("rooms", [
                route("user/:userId", "./routes/rooms._index.tsx"),     // /rooms
                route(":id", "./routes/rooms.$id.tsx"), // /rooms/:id
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
    ]),
] satisfies RouteConfig;

import {
    type RouteConfig,
    route,
    index,
    layout,
    prefix,
} from "@react-router/dev/routes";

export default [
    layout("./routes/_main.tsx",[
    
        index("./routes/home.tsx"),
    
        layout("./routes/_protected.tsx",[
            route("profile", "./routes/profile.tsx"),

            ...prefix("rooms", [
                index("./routes/rooms._index.tsx"),     // /rooms
                route(":id", "./routes/rooms.$id.tsx"), // /rooms/:id
            ]),
        ]),

        route("search", "./routes/search.tsx"),

        route("anime/:id", "./routes/anime.$id.tsx"),
    ]),

    route("auth", "./routes/_auth.tsx",[
        index("./routes/auth._index.tsx"),
        route("login", "./routes/auth.login.tsx"),
        route("signup", "./routes/auth.signup.tsx"),
        route("callback", "./routes/auth.callback.tsx"),
    ]),
] satisfies RouteConfig;

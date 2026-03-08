import {
    type RouteConfig,
    route,
    index,
    layout,
    prefix,
} from "@react-router/dev/routes";

export default [
    layout("./layout/MainLayout.tsx",[
    
        index("./pages/Home.tsx"),
    
        layout("./layout/ProtectedLayout.tsx",[
            route("profile", "./pages/Profile.tsx"),

            ...prefix("rooms", [
                index("./pages/Rooms.tsx"),     // /rooms
                route(":id", "./pages/Room.tsx"), // /rooms/:id
            ]),
        ]),

        route("search", "./pages/SearchPage.tsx"),

        route("anime/:id", "./pages/AnimePage.tsx"),
    ]),

    route("auth", "./layout/AuthLayout.tsx",[
        index("./pages/AuthIndex.tsx"),
        route("login", "./pages/Login.tsx"),
        route("signup", "./pages/Signup.tsx"),
        route("callback", "./pages/AuthCallback.tsx"),
    ]),
] satisfies RouteConfig;

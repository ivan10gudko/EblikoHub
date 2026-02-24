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
            route("profile/:id", "./pages/Profile.tsx"),

            ...prefix("rooms", [
                index("./pages/Rooms.tsx"),     // /rooms
                route(":id", "./pages/Room.tsx"), // /rooms/:id
            ]),
        ]),

        route("search", "./pages/SearchPage.tsx"),

        route("anime/:id", "./pages/AnimePage.tsx"),
    ]),

    route("auth", "./layout/AuthLayout.tsx",[
        route("login", "./pages/login.tsx"),
        route("signup", "./pages/signup.tsx"),
    ]),
] satisfies RouteConfig;

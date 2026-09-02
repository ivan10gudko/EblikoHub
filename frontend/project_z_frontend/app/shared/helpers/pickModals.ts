import { route, } from "@react-router/dev/routes";
export type ModalRouteDef = {
    path: string;
    file: string;
};

export function pickModals<T extends Record<string, ModalRouteDef>>(
    registry: T,
    prefixName: string,
    keys: (keyof T)[] = Object.keys(registry) as (keyof T)[],
) {
    return keys.map((key) =>
        route(registry[key].path, registry[key].file, {
            id: `${prefixName}-${String(key)}`,
        }),
    );
}
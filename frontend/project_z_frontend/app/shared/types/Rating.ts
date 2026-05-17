export type Rating =
    | { overall: number;[key: string]: number }
    | Record<string, never>;

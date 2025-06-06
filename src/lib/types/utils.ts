type JsonPrimitive = string | number | boolean | null;

export type Jsonable = JsonPrimitive | Jsonable[] | { [key: string]: Jsonable };

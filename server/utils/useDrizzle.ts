import {drizzle} from "drizzle-orm/d1/driver";

import schema from '../db/schema'

export function useDrizzle() {
    return drizzle(hubDatabase(), {
        schema,
    })
}
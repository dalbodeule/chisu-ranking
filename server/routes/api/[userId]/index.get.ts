import schema from "~/server/database/schema";
import {eq} from "drizzle-orm";
import {GetUser} from "~/server/routes/api/[userId]/[pageName].get";

export interface GetPageList {
    content: {
        id: number
        pagename: string,
        content: string,
        created_at: Date,
        updated_at: Date
    }[],
    author: GetUser,
}

export default defineEventHandler(async(event) => {
    const db = useDrizzle()

    const { userId } = event.context.params as { userId: string | undefined }

    if(!userId ) throw createError({
        statusCode: 404,
        message: 'Invalid user id'
    })

    const page = await db.query.Pages.findMany({
        where: eq(schema.Pages.userId, userId)
    })
    const user = await db.query.Users.findFirst({
        where: eq(schema.Users.userId, userId),
    })

    if(!page) throw createError({
        statusCode: 404,
        message: 'Invalid page name'
    })

    const result: GetPageList = {
        content: page.map((content) => ({
            id: content.id,
            pagename: content.pagename ?? "",
            content: content.content ?? "",
            created_at: content.created_at,
            updated_at: content.updated_at
        })),
        author: {
            ...user!!
        }
    }

    return result
})
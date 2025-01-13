import schema from "~/server/database/schema";
import {and, eq} from "drizzle-orm";
import {GetPage} from "~/server/routes/api/[userId]/[pageName].get";

export interface PostPage {
    id: number,
    pagename: string,
    content: string,
}

export default defineEventHandler(async(event) => {
    const db = useDrizzle()

    const { userId, pageName } = event.context.params as { userId: string | undefined, pageName: string | undefined }

    if(!userId || !pageName) throw createError({
        statusCode: 404,
        message: 'Invalid user id or page name'
    })

    const decodedPageName = decodeURIComponent(pageName)

    const page = await db.query.Pages.findFirst({
        where: and(
            eq(schema.Pages.userId, userId),
            eq(schema.Pages.pagename, decodedPageName)
        ),
        with: {
            author: true
        }
    })

    if(!page) throw createError({
        statusCode: 404,
        message: 'Invalid page name'
    })

    const result: GetPage = {
        id: page.id,
        pagename: page.pagename ?? "",
        content: page.content ?? "",
        created_at: page.created_at,
        updated_at: page.updated_at,
        author: {
            ...page.author!!
        }
    }

    return result
})
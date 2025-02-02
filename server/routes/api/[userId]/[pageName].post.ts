import schema from "~/server/database/schema";
import {and, eq} from "drizzle-orm";
import type {GetPage} from "~/server/routes/api/[userId]/[pageName].get";

export interface PostPage {
    content: string,
}

export default defineEventHandler(async(event) => {
    const session = await getUserSession(event)

    if(!session) throw createError({
        statusCode: 403,
        message: 'No such session',
    })

    const { userId, pageName } = event.context.params as { userId: string | undefined, pageName: string | undefined }
    const { content } = await readBody(event) as { content: string | undefined }

    if(!userId || !pageName) throw createError({
        statusCode: 404,
        message: 'Invalid user id or page name'
    })

    if(userId != session.user.channelId) throw createError({
        statusCode: 403,
        message: 'Not authorized'
    })

    const db = useDrizzle()

    const decodedPageName = decodeURIComponent(pageName)

    let page = await db.query.Pages.findFirst({
        where: and(
            eq(schema.Pages.userId, session.user.channelId),
            eq(schema.Pages.pagename, decodedPageName)
        ),
        with: {
            author: true
        }
    })

    if(page) {
        const query = await db.update(schema.Pages).set({
            content,
            updated_at: new Date()
        }).where(and(
            eq(schema.Pages.userId, session.user.channelId),
            eq(schema.Pages.pagename, decodedPageName)
        )).execute()

        if(!query) throw createError({
            statusCode: 500,
            message: 'Internal server error'
        })
    } else {
        const query = await db.insert(schema.Pages).values({
            userId: session.user.channelId,
            pagename: decodedPageName,
            content: content,
        }).execute()

        if(!query) throw createError({
            statusCode: 500,
            message: 'Internal server error'
        })

        page = await db.query.Pages.findFirst({
            where: and(
                eq(schema.Pages.userId, session.user.channelId),
                eq(schema.Pages.pagename, decodedPageName)
            ),
            with: {
                author: true
            }
        })
    }

    if(!page) throw createError({
        statusCode: 500,
        message: 'Internal server error'
    })

    const result: GetPage = {
        id: page.id,
        pagename: page.pagename ?? "",
        content: page.content ?? "",
        created_at: page.created_at,
        updated_at: page.updated_at,
        author: {
            ...page.author!
        }
    }

    return result
})
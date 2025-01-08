import schema from "~/server/database/schema";
import {eq} from "drizzle-orm";

export interface IResponse<T> {
    code: number,
    message: string | null,
    content: T | null
}

export interface ITokenRequest {
    grantType: "authorization_code" | "refresh_token",
    clientId: string,
    clientSecret: string,
    code: string,
    state: string | null,
}

export interface ITokenResponse {
    accessToken: string,
    refreshToken: string,
    tokenType: "Bearer",
    expiresIn: number,
}

export interface IUserResponse {
    channelId: string,
    channelName: string,
}

const url = 'https://openapi.chzzk.naver.com'

export default defineEventHandler(async(event) => {
    const config = useRuntimeConfig(event)

    const { code, state} = getQuery(event)

    if(!code || !state) throw createError({
        statusCode: 400,
        message: 'Unauthorized',
    })

    const reqBody: ITokenRequest = {
        grantType: "authorization_code",
        clientId: config.chzzk.clientId,
        clientSecret: config.chzzk.clientSecret,
        code: code.toString(),
        state: state.toString(),
    }

    const tokenResponse = await fetch(`${url}/auth/v1/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody)
    })
    const token = await tokenResponse.json() as IResponse<ITokenResponse>

    if(token.code != 200 || token.content == null) {
        // console.log(token)
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const userResponse = await fetch(`${config.chzzk.apiCallUri}/open/v1/users/me`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.content.accessToken}`
        }
    })
    const user = await userResponse.json() as IResponse<IUserResponse>

    if(user.code != 200 || user.content == null) {
        // console.log(user)
        throw createError({
            statusCode: 400,
            message: 'Unauthorized',
        })
    }

    const db = useDrizzle()

    const userRow = await db.query.Users.findFirst({
        where: eq(schema.Users.userId, user.content.channelId)
    })

    if(!userRow) {
        await db.insert(schema.Users).values({
            userId: user.content.channelId,
            name: user.content.channelName,
        }).returning()
    } else {
        await db.update(schema.Users).set({
            name: user.content.channelName
        }).where(eq(schema.Users.userId, user.content.channelId))
    }

    await setUserSession(event, {
        user: {
            channelId: user.content.channelId,
            name: user.content.channelName,
        },
        secure: {
            accessToken: token.content.accessToken,
        }
    })

    return sendRedirect(event, '/')
})
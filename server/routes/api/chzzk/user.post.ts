import { getChzzkUserInfo } from "@/server/utils/chzzkApi"

export default defineEventHandler(async(event) => {
    const { userId } = await readBody(event) as { userId: string | undefined }

    if(!userId) throw createError({
        status: 404,
        message: 'UserId not found'
    })

    const profile = await getChzzkUserInfo(userId)

    if(!profile || !profile.content) throw createError({
        status: 404,
        message: 'User not found'
    })

    return profile.content
})
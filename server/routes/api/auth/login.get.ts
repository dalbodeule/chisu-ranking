const url = 'https://chzzk.naver.com'

export default defineEventHandler(async(event) => {
    const session = await getUserSession(event)

    const config = useRuntimeConfig(event)
    const state = "asdfasdfasdfjiasdf"

    const requestUrl = `${url}/account-interlock?clientId=${config.chzzk.clientId}&redirectUri=${config.chzzk.redirectUri}&state=${state}`

    return sendRedirect(event, requestUrl)
})
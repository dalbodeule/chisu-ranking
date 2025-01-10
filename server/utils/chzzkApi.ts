export interface IChzzkData<T> {
    code: number,
    message: string | undefined,
    content: T | undefined
}

export interface IChzzkChannel {
    channelId: string,
    channelName: string,
    channelImageUrl: string,
    verifiedMark: boolean
}

const url = "https://api.chzzk.naver.com"
const _USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Whale/4.29.282.14 Safari/537.36"

export const getChzzkUserInfo = async (userId: String): Promise<IChzzkData<IChzzkChannel>> => {
    return await $fetch(`${url}/service/v1/channels/${userId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': _USER_AGENT
        }
    }) as IChzzkData<IChzzkChannel>
}
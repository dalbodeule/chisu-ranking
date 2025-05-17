export interface IChzzkData<T> {
  code: number;
  message: string | undefined;
  content: T | undefined;
}

export interface IChzzkChannel {
  data: IChzzkChannelUser[];
}

export interface IChzzkChannelUser {
  channelId: string;
  channelName: string;
  channelImageUrl: string;
  followerCount: number;
}

const url = "https://openapi.chzzk.naver.com";
const _USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Whale/4.29.282.14 Safari/537.36";

export const getChzzkUserInfo = async (
  userId: string,
  clientId: string,
  clientSecret: string,
): Promise<IChzzkData<IChzzkChannel>> => {
  const response = await fetch(`${url}/open/v1/channels?channelIds=${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": _USER_AGENT,
      "Client-Id": clientId,
      "Client-Secret": clientSecret,
    },
  });

  return await response.json() as IChzzkData<IChzzkChannel>
};

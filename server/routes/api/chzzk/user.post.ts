import { getChzzkUserInfo } from "@/server/utils/chzzkApi";

export default defineEventHandler(async (event) => {
  const { userId } = (await readBody(event)) as { userId: string | undefined };
  const config = useRuntimeConfig(event);

  if (!userId)
    throw createError({
      status: 404,
      message: "UserId not found",
    });

  const profile = await getChzzkUserInfo(
    userId,
    config.chzzk.clientId,
    config.chzzk.clientSecret,
  );

  console.log(profile.content?.data);

  if (!profile || !profile.content?.data)
    throw createError({
      status: 404,
      message: "User not found",
    });

  return profile.content?.data?.at(0);
});

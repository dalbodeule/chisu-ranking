const url = "https://chzzk.naver.com";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const state = Math.random().toString(36).substr(2, 11);
  await setUserSession(event, {
    state,
  });

  const requestUrl = `${url}/account-interlock?clientId=${config.chzzk.clientId}&redirectUri=${config.chzzk.redirectUri}&state=${state}`;

  return sendRedirect(event, requestUrl);
});

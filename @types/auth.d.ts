declare module '#auth-utils' {
    interface User {
        channelId: string
        channelName: string
    }

    interface UserSession {
        state: string,
        accessToken?: string,
        refreshToken?: string,
        user: User
    }

    interface SecureSessionData {

    }
}

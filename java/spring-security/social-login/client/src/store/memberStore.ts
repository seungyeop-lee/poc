import {create} from "zustand";
import {persist} from "zustand/middleware";

interface MemberStore {
    accessToken: string | undefined;
    refreshToken: string | undefined;
    obtainAccessToken: (code: string) => void;
    refreshAccessToken: () => void;
}

export const useMemberStore = create(persist<MemberStore>((set, get) => ({
    accessToken: undefined,
    refreshToken: undefined,
    async obtainAccessToken(code) {
        const response = await fetch(
            `http://localhost:8080/auth/token?code=${code}`,
        );

        const tokens = getTokens(response);
        set({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        })
    },
    async refreshAccessToken() {
        const refreshToken = get().refreshToken;
        if (refreshToken === undefined) {
            alert('Refresh Token이 없습니다.');
            return;
        }

        const response = await fetch(
            `http://localhost:8080/auth/refresh`,
            {
                headers: {
                    'X-Refresh-Authorization': refreshToken
                }
            }
        );

        const tokens = getTokens(response);
        set({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    }
}), {
    name: 'member-store'
}));

function getTokens(response: Response) {
    let accessToken = response.headers.get('Authorization') || '';
    let refreshToken = response.headers.get('X-Refresh-Authorization') || '';

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
}

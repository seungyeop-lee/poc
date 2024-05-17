import {create} from "zustand";
import {persist} from "zustand/middleware";

interface MemberStore {
    accessToken: string | undefined;
    refreshToken: string | undefined;
    obtainAccessToken: (code: string) => void;
}

export const useMemberStore = create(persist<MemberStore>((set, get) => ({
    accessToken: undefined,
    refreshToken: undefined,
    async obtainAccessToken(code) {
        let response = await fetch(
            `http://localhost:8080/auth/token?code=${code}`,
        );

        let accessToken = response.headers.get('Authorization') || '';
        let refreshToken = response.headers.get('X-Refresh-Authorization') || '';

        set({
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    }
}), {
    name: 'member-store'
}));

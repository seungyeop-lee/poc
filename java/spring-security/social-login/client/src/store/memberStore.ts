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

        let tokenRecord = await response.json();
        if (tokenRecord) {
            set({
                accessToken: tokenRecord.access,
                refreshToken: tokenRecord.refresh
            });
        }
    }
}), {
    name: 'member-store'
}));

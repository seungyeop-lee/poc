import {create} from "zustand";
import {persist} from "zustand/middleware";

interface MemberStore {
    accessToken: string | undefined;
    obtainAccessToken: (code: string) => void;
}

export const useMemberStore = create(persist<MemberStore>((set, get) => ({
    accessToken: undefined,
    async obtainAccessToken(code) {
        let response = await fetch(
            `http://localhost:8080/auth/token?code=${code}`,
        );

        let token = await response.text();
        if (token) {
            set({accessToken: token});
        }
    }
}), {
    name: 'member-store'
}));

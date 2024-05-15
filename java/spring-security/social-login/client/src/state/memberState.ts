import {create} from "zustand";
import {persist} from "zustand/middleware";

interface MemberState {
    accessToken: string | undefined;
    obtainAccessToken: (code: string) => void;
}

export const useMemberState = create(persist<MemberState>((set, get) => ({
    accessToken: undefined,
    async obtainAccessToken(uuid) {
        let response = await fetch(
            `http://localhost:8080/auth/token?uuid=${uuid}`,
        );

        let token = await response.text();
        set({accessToken: token});
    }
}), {
    name: 'member-state-storage'
}));

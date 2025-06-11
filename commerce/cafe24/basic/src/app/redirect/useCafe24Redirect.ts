import {useSearchParams} from "next/navigation";
import {LocalStorage} from "@/utils/LocalStorage";
import requestTokenByCode from "@/server/requestTokenByCode";
import requestTokenByRefreshToken from "@/server/requestTokenByRefreshToken";
import requestListAllProduct from "@/server/requestListAllProduct";

export function useCafe24Redirect() {
    const searchParams = useSearchParams();

    return {
        isValid: () => {
            const state = searchParams.get('state');
            const savedState = LocalStorage.getItem('state');
            return state === savedState;
        },
        requestTokenByCode: async () => {
            const code = searchParams.get('code') || '';
            const mallId = LocalStorage.getItem('mallId') || '';
            return await requestTokenByCode(mallId, code);
        },
        requestTokenByRefreshToken: async (refreshToken: string) => {
            const mallId = LocalStorage.getItem('mallId') || '';
            return await requestTokenByRefreshToken(mallId, refreshToken);
        },
        requestListAllProduct: async (accessToken: string) => {
            const mallId = LocalStorage.getItem('mallId') || '';
            return await requestListAllProduct(mallId, accessToken);
        }
    }
}

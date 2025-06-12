import {redirect, useSearchParams} from "next/navigation";
import {LocalStorage} from "@/utils/LocalStorage";
import buildAuthRedirectUrl from "@/server/buildAuthRedirectUrl";
import {useEffect, useState} from "react";
import checkHmac from "@/server/checkHmac";

export function useCafe24AuthRequest() {
    const searchParams = useSearchParams();
    const [authUrl, setAuthUrl] = useState<string>()

    useEffect(() => {
        (async () => {
            const mallId = searchParams.get('mall_id')!;
            LocalStorage.setItem('mallId', mallId);
            const state = Date.now().toString();
            LocalStorage.setItem('state', state);

            const redirectUrl = await buildAuthRedirectUrl(mallId, state);
            setAuthUrl(redirectUrl)
        })()
    }, [])

    return {
        isValid: async () => {
            const queryString = searchParams.toString();
            const truncatedQuery = queryString.substring(0, queryString.lastIndexOf('&'));
            const hmacValue = decodeURIComponent(searchParams.get('hmac') || '');
            if (!hmacValue) {
                return false;
            }

            return await checkHmac(hmacValue, truncatedQuery)
        },
        authUrl,
        requestAuth: () => {
            if (!authUrl) {
                return;
            }
            redirect(authUrl);
        }
    };
}

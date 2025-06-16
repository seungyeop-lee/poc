'use client'

import {useCafe24Redirect} from "@/app/redirect/useCafe24Redirect";
import {useEffect, useState} from "react";
import NoSSRWrapper from "@/components/NoSSRWrapper";
import requestOrderInfo from "@/server/requestOrderInfo";

export default function RedirectPage() {
    const {isValid, requestTokenByCode, requestTokenByRefreshToken, requestListAllProduct, requestOrderInfo} = useCafe24Redirect();
    const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
    const [fetchResult, setFetchResult] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        if (!tokenInfo) {
            return;
        }

        console.log('Token Info:', tokenInfo);
    }, [tokenInfo])

    useEffect(() => {
        if (!fetchResult) {
            return;
        }

        console.log('Fetch Result:', fetchResult);
    }, [fetchResult]);

    return (
        <NoSSRWrapper>
            <div className="p-10 space-y-3">
                <p>State Valid: {isValid() ? 'yes' : 'no'}</p>
                <button className="btn" onClick={async () => {
                    const tokenInfo = await requestTokenByCode();
                    setTokenInfo(tokenInfo);
                }}>Request Token (by code)
                </button>
                <br/>
                {tokenInfo && <>
                    <p>Token Info: {JSON.stringify(tokenInfo)}</p>
                    <div>
                        <button className="btn" onClick={async () => {
                            const newTokenInfo = await requestTokenByRefreshToken(tokenInfo?.refresh_token || '');
                            setTokenInfo(newTokenInfo);
                        }}>Request Token (by refreshToken)
                        </button>
                        <button className="btn" onClick={async () => {
                            const allProduct = await requestListAllProduct(tokenInfo?.access_token);
                            setFetchResult(JSON.stringify(allProduct));
                        }}>all Product List
                        </button>
                    </div>
                    <div>
                        <input className="input" placeholder="OrderId" value={orderId || ''} onChange={(e) => setOrderId(e.target.value)}/>
                        <button className="btn" onClick={async () => {
                            if (!orderId) {
                                alert('Please input OrderId');
                                return;
                            }
                            const orderInfo = await requestOrderInfo(tokenInfo?.access_token, orderId);
                            setFetchResult(JSON.stringify(orderInfo));
                        }}>Order Info.</button>
                    </div>
                    <p>Fetch Result: {fetchResult}</p>
                </>}

            </div>
        </NoSSRWrapper>
    )
}

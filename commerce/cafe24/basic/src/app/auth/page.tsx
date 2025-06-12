"use client";

import {useCafe24AuthRequest} from "@/app/auth/useCafe24AuthRequest";
import NoSSRWrapper from "@/components/NoSSRWrapper";
import {useEffect, useState} from "react";

export default function AuthPage() {
    const {isValid, authUrl, requestAuth} = useCafe24AuthRequest();
    const [valid, setValid] = useState<boolean>(false);
    useEffect(() => {
        (async () => {
            setValid(await isValid());
        })()
    }, []);

    return (
        <NoSSRWrapper>
            <div className="p-10 space-y-3">
                <p>HMAC Valid: {valid ? 'yes' : 'no'}</p>
                <button className="btn" onClick={requestAuth}>Request Auth</button>
                <p>Redirect URL: {authUrl}</p>
            </div>
        </NoSSRWrapper>
    );
}

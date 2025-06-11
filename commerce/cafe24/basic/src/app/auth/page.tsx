"use client";

import {useCafe24AuthRequest} from "@/app/auth/useCafe24AuthRequest";

export default function AuthPage() {
    const {isValid, authUrl, requestAuth} = useCafe24AuthRequest();

    return (
        <div className="p-10 space-y-3">
            <p>HMAC Valid: {isValid() ? 'yes' : 'no'}</p>
            <button className="btn" onClick={requestAuth}>Request Auth</button>
            <p>Redirect URL: {authUrl}</p>
        </div>
    );
}

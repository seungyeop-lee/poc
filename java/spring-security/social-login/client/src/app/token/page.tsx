'use client';

import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {useMemberStore} from "@/store/memberStore";

export default function TokenPage() {
    const { obtainAccessToken } = useMemberStore();
    let router = useRouter();
    let searchParams = useSearchParams();
    let code = searchParams.get("code");

    useEffect(() => {
        if (code) obtainAccessToken(code);
        router.push("/");
    }, [obtainAccessToken, code]);

    return <></>;
}

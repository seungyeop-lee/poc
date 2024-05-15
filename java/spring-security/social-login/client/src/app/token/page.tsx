'use client';

import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {useMemberState} from "@/state/memberState";

export default function TokenPage() {
    const { obtainAccessToken } = useMemberState();
    let router = useRouter();
    let searchParams = useSearchParams();
    let uuid = searchParams.get("uuid");

    useEffect(() => {
        if (uuid) obtainAccessToken(uuid);
        router.push("/");
    }, [obtainAccessToken, uuid]);

    return <></>;
}

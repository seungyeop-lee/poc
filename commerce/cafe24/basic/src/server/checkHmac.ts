'use server'

import ServerEnv from "@/config/serverEnv";
import {makeHmac} from "@/utils/crypto";

export default async function checkHmac(hmac: string, truncatedQuery: string) {
    const SECRET_KEY = ServerEnv.CAFE24_SECRET_KEY;
    const madeHmac = makeHmac(truncatedQuery, SECRET_KEY);
    return madeHmac === hmac
}

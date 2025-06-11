'use server'

import {Buffer} from "buffer";
import axios from "axios";
import ServerEnv from "@/config/serverEnv";

const clientId = ServerEnv.CAFE24_CLIENT_ID;
const clientSecretKey = ServerEnv.CAFE24_SECRET_KEY;
const redirectUri = ServerEnv.CAFE24_REDIRECT_URL;

export default async function requestTokenByCode(mallId: string, code: string): Promise<TokenInfo> {
    const basicAuth = Buffer.from(`${clientId}:${clientSecretKey}`).toString('base64');

    try {
        const response = await axios.post(
            `https://${mallId}.cafe24api.com/api/v2/oauth/token`,
            {
                grant_type: 'authorization_code',
                code: code || '',
                redirect_uri: redirectUri
            },
            {
                headers: {
                    'Authorization': `Basic ${basicAuth}`,
                    'content-type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Token request failed:', (error as any).toString());
        throw error;
    }
}

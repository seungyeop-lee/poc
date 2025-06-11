'use server'

import {Buffer} from "buffer";
import axios from "axios";
import ServerEnv from "@/config/serverEnv";

const clientId = ServerEnv.CAFE24_CLIENT_ID;
const clientSecret = ServerEnv.CAFE24_SECRET_KEY;

export default async function requestTokenByRefreshToken(mallId: string, refresh_token: string): Promise<TokenInfo> {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await axios.post(
            `https://${mallId}.cafe24api.com/api/v2/oauth/token`,
            {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
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

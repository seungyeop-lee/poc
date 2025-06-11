'use server'

import {QueryStringBuilder} from "@/utils/QueryStringBuilder";
import ServerEnv from "@/config/serverEnv";

const clientId = ServerEnv.CAFE24_CLIENT_ID;
const returnUrl = ServerEnv.CAFE24_REDIRECT_URL;
const scope = ServerEnv.CAFE24_SCOPE;

export default async function buildAuthRedirectUrl(mallId: string, state: string) {
    const baseUrl = `https://${mallId}.cafe24api.com/api/v2/oauth/authorize`;
    const urlBuilder = new QueryStringBuilder(baseUrl);
    urlBuilder.addQueryString('response_type', 'code');
    urlBuilder.addQueryString('client_id', clientId);
    urlBuilder.addQueryString('state', state);
    urlBuilder.addQueryString('redirect_uri', returnUrl);
    urlBuilder.addQueryString('scope', scope);
    return urlBuilder.build();
}

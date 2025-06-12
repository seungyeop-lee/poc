import 'server-only'

const ServerEnv = {
    CAFE24_CLIENT_ID: process.env.CAFE24_CLIENT_ID!,
    CAFE24_SECRET_KEY: process.env.CAFE24_SECRET_KEY!,
    CAFE24_REDIRECT_URL: process.env.CAFE24_REDIRECT_URL!,
    CAFE24_SCOPE: process.env.CAFE24_SCOPE!,
}

export default ServerEnv;

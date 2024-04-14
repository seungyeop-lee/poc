import './App.css'
import {AuthContext, AuthProvider, IAuthContext, TAuthConfig, TRefreshTokenExpiredEvent} from "react-oauth2-code-pkce";
import {useContext} from "react";

const authConfig: TAuthConfig = {
    clientId: 'oidc-client',
    authorizationEndpoint: 'http://localhost:8080/oauth2/authorize',
    tokenEndpoint: 'http://localhost:8080/oauth2/token',
    redirectUri: 'http://localhost:3000/',
    scope: 'openid profile',
    onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) => window.confirm('Session expired. Refresh page to continue using the site?') && event.login(),
}

const UserInfo = () => {
    const {token, tokenData} = useContext<IAuthContext>(AuthContext)

    return <>
        <h4>Access Token</h4>
        <pre>{token}</pre>
        <h4>User Information from JWT</h4>
        <pre>{JSON.stringify(tokenData, null, 2)}</pre>
    </>
}

function App() {
    return <>
        <AuthProvider authConfig={authConfig}>
            <UserInfo/>
        </AuthProvider>
    </>
}

export default App

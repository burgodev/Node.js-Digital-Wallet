import axios from "axios";
import cache_client from "./cache";
import APIError from "../errors/api-error";
import { HttpStatusCode } from "./response";
import { l } from "./logs";

const TOKEN_CACHE_KEY = "AX_TOKEN";
const AUTH_REQUESTS_CACHE_KEY = "AX_AUTH_REQUESTS";

const AXApi = axios.create({
    baseURL: process.env.AX_URL,
    headers: {
        "Content-Type": "application/json",
        codigoCliente: process.env.AX_CODECLIENT,
    },
});

/**
 * Add the token to AX request.
 */
const addTokenInterceptor = AXApi.interceptors.request.use(async (config) => {
    const token = await auth();
    config.headers.token = token;

    return config;
});

/**
 * Verify if the token is expired, then generate a new and retry the request.
 */
const verifyUnauthorizedInterceptor = AXApi.interceptors.response.use(null, async (error) => {
    if (error.config && error.response && error.response.status === HttpStatusCode.UNAUTHORIZED) {
        await cache_client.del(TOKEN_CACHE_KEY);
        const token = await auth();
        error.config.headers.token = token;
        return AXApi.request(error.config);
    }

    return Promise.reject(error);
});

/**
 * Get the token from redis cache or create a new one in AX api.
 */
const auth = async (): Promise<string> => {
    const token = await cache_client.get(TOKEN_CACHE_KEY);
    if (token) return token;

    await verify_auth_requests();
    
    const params = {
        integracaoClienteId: process.env.AX_CLIENTID,
        login: process.env.AX_LOGIN,
        senha: process.env.AX_PASSWORD,
        codigoCliente: process.env.AX_CODECLIENT,
    };
    
    AXApi.interceptors.request.eject(addTokenInterceptor);
    AXApi.interceptors.response.eject(verifyUnauthorizedInterceptor);

    const { data } = await AXApi.post("/Auth/Autenticar", params);

    if (!data.retorno.validado) throw new APIError("ax.error.unautenticated");

    const new_token = data.token;
    await cache_client.setEx(TOKEN_CACHE_KEY, 2592000, new_token); // Expires in one month
    return new_token;
};

const verify_auth_requests = async () => {
    const requests = await cache_client.get(AUTH_REQUESTS_CACHE_KEY);
    const auth_requests = (requests ? Number(requests) : 0) + 1;
    await cache_client.setEx(AUTH_REQUESTS_CACHE_KEY, 86400, auth_requests.toString());
    l.warn("Authenticating on AXBank api", { count: auth_requests });
}

export default AXApi;

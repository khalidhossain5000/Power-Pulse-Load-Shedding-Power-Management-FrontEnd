import { ofetch } from "ofetch";

// const baseURL = process.env.NEXT_PUBLIC_BASE_URL_Production;
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;



let refreshPromise: Promise<unknown> | null = null;

const apiClient = ofetch.create({
    baseURL,
    credentials: "include",

    async onResponseError({ request,response, options }) {
        const url = request.toString();

    if (url.includes("/auth/login")) {
        return;
    }
        // Only handle unauthorized responses
        if (response.status !== 401) {
            return;
        }
        if (options.retry === 0) {
            return;
        }

        console.log("401 detected");

        // If another request is already refreshing,wait for the same refresh request.
        if (!refreshPromise) {
            refreshPromise = ofetch("/auth/refresh-token", {
                baseURL,
                method: "POST",
                credentials: "include",
            }).finally(() => {
                refreshPromise = null;
            });
        }

        // Wait for refresh to complete
        await refreshPromise;

        console.log("refresh successful");

     
        options.retry = 1;
        options.retryStatusCodes = [401];
    },
});

export default apiClient;
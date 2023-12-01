import axios from "axios";
let apiBaseURL = process.env.VUE_CATALOG_URL
console.log("apiBaseURL......", process.env.VUE_CATALOG_URL);
const api = axios.create({
    baseURL: apiBaseURL || "http://localhost:3002",
});
api.interceptors.request.use(
    (config) => {
        // Modify the request config before sending the request
        console.log("localStorage.getItem('app-token')", localStorage.getItem('app-token'))
        const token = localStorage.getItem('app-token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // config.withCredentials= true;
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);
api.interceptors.response.use(
    (response) => {
        // Modify the response data before resolving the promise
        return response.data;
    },
    (error) => {
        // Handle response error
        return Promise.reject(error);
    }
);



export default api;
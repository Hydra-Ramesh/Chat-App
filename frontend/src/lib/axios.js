import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:3002/api/v1",
    withCredentials: true,
})
import axios from "axios";

const MT5Api = axios.create({
    baseURL: process.env.MT5_URL,
});

export default MT5Api;
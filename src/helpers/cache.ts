import { createClient } from "redis";
import redisConfig from "../config/redis";
import { l } from "./logs";

const cache_client = createClient({
    url: `redis://:${redisConfig.password}@${redisConfig.host}:${redisConfig.port}`,
    // url: `redis://@${redisConfig.host}:${redisConfig.port}`,
    // url: `redis://${redisConfig.username}:${redisConfig.password}@${redisConfig.host}:${redisConfig.port}`,
});

cache_client.on("error", (err) => l.error("error on cache client", err));
cache_client.connect();

export default cache_client;

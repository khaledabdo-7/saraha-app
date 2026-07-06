import { createClient } from "redis";

export const client = createClient({
  url: process.env.REDIS_URL,
});


export const redisConnection = async () => {
    try {
        await client.connect()
        console.log("Redis connected successfully")
    } catch (error) {
        console.error("Redis connected error",error)
        process.exit(1)
    }
}
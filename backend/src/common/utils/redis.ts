import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("❌ REDIS_URL is not defined in the environment variables");
}
export const redis = new IORedis({
  host: 'ticket-redis',
  port: 6379,
  maxRetriesPerRequest: null,  
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

export default redis;

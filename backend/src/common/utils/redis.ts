import Redis from "ioredis";

// Ortam değişkeninden Redis bağlantısını al
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Bağlantı olaylarını dinle (isteğe bağlı)
redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

export default redis;

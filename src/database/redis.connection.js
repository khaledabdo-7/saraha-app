import { createClient } from "redis";

const memoryStore = new Map();

class InMemoryRedisFallback {
  async connect() {
    console.log("Using In-Memory Cache for Token Blacklist (Redis Fallback)");
  }
  async get(key) {
    return memoryStore.get(key) || null;
  }
  async set(key, val, options) {
    memoryStore.set(key, val);
    if (options?.EX) {
      setTimeout(() => memoryStore.delete(key), options.EX * 1000);
    }
    return "OK";
  }
}

let activeClient = new InMemoryRedisFallback();

if (process.env.REDIS_URL && !process.env.REDIS_URL.includes("clean-reptile-153523")) {
  activeClient = createClient({
    url: process.env.REDIS_URL,
  });
}

export const client = activeClient;

export const redisConnection = async () => {
  try {
    if (activeClient instanceof InMemoryRedisFallback) {
      await activeClient.connect();
      return;
    }
    await activeClient.connect();
    console.log("Redis connected successfully");
  } catch (error) {
    console.warn("Redis host unreachable. Falling back to In-Memory store.");
    activeClient = new InMemoryRedisFallback();
  }
};

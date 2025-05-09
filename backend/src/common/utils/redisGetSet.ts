import IORedis from './redis';

export async function getFromRedis(key: string): Promise<string | null> {
    try {
        return await IORedis.get(key);
    } catch (err) {
        console.error(`Redis GET error for key ${key}:`, err);
        return null;
    }
}


export async function setToRedis(key: string, value: string, expirationSeconds: number): Promise<void> {
    try {
        await IORedis.set(key, JSON.stringify(value), "EX", expirationSeconds)
    } catch (err) {
        console.error(`Redis SET error for key ${key}:`, err);
    }
}
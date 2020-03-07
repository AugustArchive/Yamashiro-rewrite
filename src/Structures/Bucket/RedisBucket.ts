import { Redis } from 'ioredis';

export default class RedisBucket<T> {
    public redis: Redis;
    public key: string;

    constructor(redis: Redis, key: string) {
        this.redis = redis;
        this.key   = key;
    }

    async get(): Promise<T | null> {
        const value = await this.redis.get(this.key);
        if (!value) return null;
        return JSON.parse(value!);
    }

    async add(value: string) {
        await this.redis.set(this.key, value);
    }

    async first(): Promise<T> {
        const el = await this.redis.lindex(this.key, 0);
        return JSON.parse(el);
    }

    async last(): Promise<T> {
        const el = await this.redis.lindex(this.key, -1);
        return JSON.parse(el);
    }

    size() {
        return this.redis.llen(this.key);
    }
}
import { RedisClientType } from '@redis/client';
import * as redis from 'redis';

export interface IRedisService {

    init: () => void;
    read: (key: string) => Promise<string>
    write: (key: string, value: string) => Promise<string>
}

const REDIS_HOST = "redis";
const REDIS_PORT = 6379

export class RedisService implements IRedisService {

    client: RedisClientType;

    constructor() {
    }

    async init() {
        this.client = redis.createClient({ 
            socket: {
                host : REDIS_HOST,
                port: REDIS_PORT
            }
        })

        await this.client.connect()
    }

    async read(key: string) {
        
        return await this.client.get(key);
    }

    async write(key: string, value: string) {
        
        return await this.client.set(key,value);
    }
}



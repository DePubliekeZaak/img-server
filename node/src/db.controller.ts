import { IPostgresService, PostgresService } from "./postgres.service";
import { IBucketService, BucketService } from "./bucket.service";
import { IRedisService, RedisService } from "./redis.service";
import fs from 'fs';

export interface IDbController {

    prepare: (db: string) => void;
    create: (db: string) => void;
    addViewToApi: (view: string, db: string) => void;
}

export class DbController implements IDbController {

    postgres : IPostgresService;
    bucket : IBucketService;
    redis: IRedisService;

    constructor() {
        
        this.bucket = new BucketService();
        this.postgres = new PostgresService();
        this.redis = new RedisService();
        this.init();
    }

    async init() {
        await this.redis.init();
    }

    async create(db: string) {
     

        try {
            await this.postgres.create(db);
            await this.bucket.fetchBackup();
            await this.postgres.restoreDump(db) 

        } catch(err) {
            console.log(err);
        }
        return {
            msg : 'created and populated ' + db 
        }
    }

    async drop(db: string) {

        const success = await this.postgres.drop(db);
        const msg = (success) ? 'deleted ' + db : 'failed to delete ' + db;
        return { msg }
    }

    async update(db: string) {

        await this.drop(db);
        await this.create(db);
        return {
            msg : 'copied recent backup to ' + db 
        }
    }

    async backup(db: string, name: string) {

        const path = await this.postgres.dump(db,name);
        const fileStream = await fs.createReadStream(path);
        const res = await this.bucket.writeFile(fileStream, name, db);

        return {
            msg : 'backup for ' + name + "-" + db 
        }
    }

    async config() {

        return {
            'LIVE' : await this.redis.read('live_db'),
            'STAGING' : await this.redis.read('staging_db'),
            'NEW' : await this.redis.read('new_db'),
        }
    }

    async setDb(name: string, db: string) {
        
        await this.redis.write(name, db);
        return await this.config();
    }

    async prepare(db: string) {

        this.redis.write('new_db',db);
        return await this.update(db);
    }

    async import() {

    }

    async stage() {

        // of vaste live db en vaste staging db en dan dump + restore 
    }

    async publish() {

    }

    async addViewToApi(view: string, db: string) {

        const success = await this.postgres.addView(view, db);

        const msg = (success) ? 'add public read permissions for ' + view : 'failed to add permissions for ' + view;

        return { msg }
    }

    

}

// -- Table: main.mms

// -- DROP TABLE IF EXISTS main.mms;

// CREATE TABLE IF NOT EXISTS main.mms
// (
//     datum character varying COLLATE pg_catalog."default",
//     gemeente character varying COLLATE pg_catalog."default",
//     _year integer,
//     _month integer,
//     _week integer,
//     pgv character varying COLLATE pg_catalog."default",
//     historie_nam_cvw boolean,
//     historie_tcmg_img boolean,
//     afwijzingen integer,
//     toekenningen integer,
//     gemiddeld_verleend integer
// )

// TABLESPACE pg_default;

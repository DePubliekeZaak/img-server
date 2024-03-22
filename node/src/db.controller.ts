import { IPostgresService, PostgresService } from "./postgres.service";
import { IBucketService, BucketService } from "./bucket.service";
import { IRedisService, RedisService } from "./redis.service";
import fs from 'fs';

export interface IDbController {

    prepare: (db: string) => void;
    create: (db: string, source: string) => void;
    addViewToApi: (view: string, db: string) => void;
}

declare global {
    interface Date {
        getWeek () : Number
    }
}

Date.prototype.getWeek = function() {
    var onejan : any = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
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

    async create(db: string, source: string) {
     

        try {
            await this.postgres.create(db);
            await this.bucket.fetchBackup();
            await this.postgres.restoreDump(db, source) 

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
        await this.create(db,"img-backup-latest");
        return {
            msg : 'copied recent backup to ' + db 
        }
    }

    async backup(db: string, name: string) {

        const now = new Date();
        const dated_name = `backup_${db}_${now.getWeek()}_${now.getFullYear()}`;

        console.log(dated_name);

        try {

            const path = await this.postgres.dump(db,name);
            const fileStream = await fs.createReadStream(path);
            const res = await this.bucket.writeFile(fileStream, "img-backup-latest");
            const fileStream_ = await fs.createReadStream(path);
            const res_ = await this.bucket.writeFile(fileStream_, dated_name);

        } catch(err) {

            console.log(err)
        }

        return {
            msg : 'backups send to digital ocean for ' + name + ' and ' + dated_name
        }
    }

    async prepare(db: string) {


    }

    async import() {

    }

    async upgrade(new_db: string, destination: string) {

        let success = true

        try {

            await this.postgres.dump(new_db,"switch_dump");
            await this.postgres.disconnect(destination);
            await this.postgres.drop(destination);
            await this.postgres.create(destination);
            await this.postgres.restoreDump(destination,"switch_dump");

        } catch(err) {
            console.log("failed to upgrade db")
            success = false; 
        }

        return success;
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

import { IPostgresService, PostgresService } from "./postgres.service";
import { IBucketService, BucketService } from "./bucket.service";
import { IRedisService, RedisService } from "./redis.service";
import { parseMmsHistory } from "./mms.factory";
import { writeFileSync } from "fs";
import { arrayToCsv, csvToArray } from "./csv.factory";
import { parseKto } from "./kto.factory";
import { parseWd } from "./wd.factory";
import { parseIms } from "./ims.factory";
import { cleanFs} from "./fs.factory";
import { cleanVes } from "./ves.factory";
import { mondayFromWeek, nextMondayFromWeek } from "./date.factory";
import { parseHistory } from "./history.factory";
import { validateCumulativeTotals } from "./validate";
import { cleanGemeenten, cleanZaaktypes } from "./clean";

export interface IDataController {

    entry: (week: string, topic: string, fileName: string, db: string) => void;
}

export class DataController implements IDataController {

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
       // await this.redis.init();
    }


    async importHistory(db: string, key: string) {

        let data = await this.bucket.readXlxs('historie/Communicatierapportage_D&I_FS.xlsx');
        data = parseHistory(data, key);
        let res1 = await this.postgres.update(data,'ves', key, db);
        return 'ok\n';
    }

    async entry2(jaar_week: string, topic: string, db: string, archive: boolean = false) {

        try {
            
            const year = jaar_week.split("_")[0];
            const week = jaar_week.split("_")[1];

            let data: any;

            console.log(year + week);

            switch (topic) {

                case 'gemeenten': 
                    data = await this.bucket.readFile(year + '/' + week + '/gemeenten.csv');
                    data = csvToArray(data,",");
                    data = cleanGemeenten(data);
                    await this.postgres.bulkInsert(data, 'gemeenten', db, "db2");
                    break;

                case 'zaaktypes': 
                    data = await this.bucket.readFile(year + '/' + week + '/zaaktypes.csv');
                    data = csvToArray(data,",");
                    data = cleanZaaktypes(data);
                    await this.postgres.bulkInsert(data, 'zaaktypes', db, "db2");
                    break;
            }

            return {
                msg : "data entry completed successfull" 
            }

        } catch(err) {

            return {
                err 
            }
        }
    }

    async entry(week: string, topic: string, db: string) {
    
        try {

            const year = 2025;
            let data: any;
            let date: Date;
            console.log('starting data entry for ' + topic);
            console.log('week: ' + week);

            switch (topic) {

                case 'ves': 

                    data = await this.bucket.readFile(year + '/' + week + '/ves.csv');
                    data = csvToArray(data,",");
                    data = cleanVes(data,date);
                    await this.postgres.bulkInsert(data,'ves', db, "db1");
                    break;


                case 'fs':

                    data = await this.bucket.readFile(year + '/' + week + '/fs.csv');
                    data = csvToArray(data,",");
                    data = cleanFs(data);
                    await this.postgres.bulkInsert(data,'fysieke_schade', db, "db1");
                    
                    break;

                // case 'mms': 
                //     data = await this.bucket.readFile(year + '/' + week + '/mms.csv');
                //     data = csvToArray(data,";");
                //     data = parseMmsHistory(data);
                //     writeFileSync("/tmp/" + topic + ".csv", arrayToCsv(data));
                //     this.postgres.importCsv(db, topic);
                //     break;

                case 'kto':
                    data = await this.bucket.readXlxs(year + '/' + week + '/kto.xlsx');
                    date = nextMondayFromWeek(week, year);// from fileName ? 
                    data = parseKto(data,date);
                    await this.postgres.bulkInsert([data],'tevredenheidscijfers', db, "db1");
                    break;

                case 'wdims':

                    data = await this.bucket.readXlxs(year + '/' + week + '/wdims.xlsx');

                    date = nextMondayFromWeek(week, year);// from fileName ? 
  
                    const imsData = parseIms(data,date,parseInt(week));
                    const wdData = parseWd(data,date,parseInt(week));
                    await this.postgres.bulkInsert([imsData],'immateriele_schade', db, "db1");
                    await this.postgres.bulkInsert([wdData],'waardedalingsregeling', db, "db1");
                    break;
            }

            return {
                msg : "data entry completed successfull" 
            }
       

        } catch(err) {

            return {
                err 
            }
        }
    }
        

    async all(week: string, db: string) {
        
        await this.entry(week, 'ves', db);
        await this.entry(week, 'fs', db);
        await this.entry(week, 'mms', db);
        await this.entry(week, 'kto', db);
        await this.entry(week, 'wdims', db);

    }

    async validate(jaar_week: string, topic: string) {

        const year = jaar_week.split("_")[0];
            const week = jaar_week.split("_")[1];
            let data: any;
            switch (topic) {

                case 'gemeenten': 
                    data = await this.bucket.readFile(year + '/' + week + '/gemeenten.csv');
                    data = csvToArray(data,",");
                    data = cleanGemeenten(data);
                    
                    break;

                case 'zaaktypes': 
                    data = await this.bucket.readFile(year + '/' + week + '/zaaktypes.csv');
                    data = csvToArray(data,",");
                    data = cleanGemeenten(data);
                    
                    break;
            }


            return await validateCumulativeTotals(data);
    }

       

}
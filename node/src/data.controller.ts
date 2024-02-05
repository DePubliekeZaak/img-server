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
        await this.redis.init();
    }

    async entry(week: string, topic: string, db: string) {
    
        try {

            const year = 2024;
            let data: any;
            let date: Date;
            console.log('starting data entry for ' + topic);

            switch (topic) {

                case 'ves': 

                    data = await this.bucket.readFile(year + '/' + week + '/ves.csv');
                    data = csvToArray(data,",");
                    data = cleanVes(data,date);
                    for (let row of data) {
                        // console.log(row);
                        let reso = await this.postgres.insert(row,'vaste_vergoeding',db);
                    }
                    break;


                case 'fs':

                    data = await this.bucket.readFile(year + '/' + week + '/fs.csv');
                    data = csvToArray(data,",");
                    data = cleanFs(data);
                    for (let row of data) {
                        // console.log(row);
                        let reso = await this.postgres.insert(row,'fysieke_schade',db);
                    }

                    break;

                case 'mms': 
                    data = await this.bucket.readFile(year + '/' + week + '/mms.csv');
                    data = csvToArray(data,";");
                    data = parseMmsHistory(data);
                    writeFileSync("/tmp/" + topic + ".csv", arrayToCsv(data));
                    this.postgres.importCsv(db, topic);
                    break;

                case 'kto':
                    data = await this.bucket.readXlxs(year + '/' + week + '/kto.xlsx');
                    date = nextMondayFromWeek(week, year);// from fileName ? 
                    data = parseKto(data,date);
                    let res = await this.postgres.insert(data,'tevredenheidscijfers',db);
                    break;

                case 'wdims':

                    data = await this.bucket.readXlxs(year + '/' + week + '/wdims.xlsx');

                    date = nextMondayFromWeek(week, year);// from fileName ? 
  
                    const imsData = parseIms(data,date,parseInt(week));
                    const wdData = parseWd(data,date,parseInt(week));
                    let res1 = await this.postgres.insert(imsData,'immateriele_schade', db);
                    let res2 = await this.postgres.insert(wdData,'waardedalingsregeling',db);
                    break;
            }

            

        } catch(err) {

            console.log(err)
        }
        return {
            msg : "data entry completed successfull" 
        }
    }

    async all(week: string, db: string) {
        
        await this.entry(week, 'ves', db);
        await this.entry(week, 'fs', db);
        await this.entry(week, 'mms', db);
        await this.entry(week, 'kto', db);
        await this.entry(week, 'wdims', db);

    }

       

}
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataController = void 0;
const postgres_service_1 = require("./postgres.service");
const bucket_service_1 = require("./bucket.service");
const redis_service_1 = require("./redis.service");
const csv_factory_1 = require("./csv.factory");
const kto_factory_1 = require("./kto.factory");
const wd_factory_1 = require("./wd.factory");
const ims_factory_1 = require("./ims.factory");
const fs_factory_1 = require("./fs.factory");
const ves_factory_1 = require("./ves.factory");
const date_factory_1 = require("./date.factory");
const history_factory_1 = require("./history.factory");
const validate_1 = require("./validate");
const clean_1 = require("./clean");
class DataController {
    constructor() {
        this.bucket = new bucket_service_1.BucketService();
        this.postgres = new postgres_service_1.PostgresService();
        this.redis = new redis_service_1.RedisService();
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // await this.redis.init();
        });
    }
    importHistory(db, key) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.bucket.readXlxs('historie/Communicatierapportage_D&I_FS.xlsx');
            data = (0, history_factory_1.parseHistory)(data, key);
            let res1 = yield this.postgres.update(data, 'ves', key, db);
            return 'ok\n';
        });
    }
    entry2(jaar_week, topic, db, archive = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const year = jaar_week.split("_")[0];
                const week = jaar_week.split("_")[1];
                let data;
                console.log(year + week);
                switch (topic) {
                    case 'gemeenten':
                        data = yield this.bucket.readFile(year + '/' + week + '/gemeenten.csv');
                        data = (0, csv_factory_1.csvToArray)(data, ",");
                        data = (0, clean_1.cleanGemeenten)(data);
                        yield this.postgres.bulkInsert(data, 'gemeenten', db, "db2");
                        break;
                    case 'zaaktypes':
                        data = yield this.bucket.readFile(year + '/' + week + '/zaaktypes.csv');
                        data = (0, csv_factory_1.csvToArray)(data, ",");
                        data = (0, clean_1.cleanZaaktypes)(data);
                        yield this.postgres.bulkInsert(data, 'zaaktypes', db, "db2");
                        break;
                }
                return {
                    msg: "data entry completed successfull"
                };
            }
            catch (err) {
                return {
                    err
                };
            }
        });
    }
    entry(week, topic, db) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const year = 2025;
                let data;
                let date;
                console.log('starting data entry for ' + topic);
                console.log('week: ' + week);
                switch (topic) {
                    case 'ves':
                        data = yield this.bucket.readFile(year + '/' + week + '/ves.csv');
                        data = (0, csv_factory_1.csvToArray)(data, ",");
                        data = (0, ves_factory_1.cleanVes)(data, date);
                        yield this.postgres.bulkInsert(data, 'ves', db, "db1");
                        break;
                    case 'fs':
                        data = yield this.bucket.readFile(year + '/' + week + '/fs.csv');
                        data = (0, csv_factory_1.csvToArray)(data, ",");
                        data = (0, fs_factory_1.cleanFs)(data);
                        yield this.postgres.bulkInsert(data, 'fysieke_schade', db, "db1");
                        break;
                    // case 'mms': 
                    //     data = await this.bucket.readFile(year + '/' + week + '/mms.csv');
                    //     data = csvToArray(data,";");
                    //     data = parseMmsHistory(data);
                    //     writeFileSync("/tmp/" + topic + ".csv", arrayToCsv(data));
                    //     this.postgres.importCsv(db, topic);
                    //     break;
                    case 'kto':
                        data = yield this.bucket.readXlxs(year + '/' + week + '/kto.xlsx');
                        date = (0, date_factory_1.nextMondayFromWeek)(week, year); // from fileName ? 
                        data = (0, kto_factory_1.parseKto)(data, date);
                        yield this.postgres.bulkInsert([data], 'tevredenheidscijfers', db, "db1");
                        break;
                    case 'wdims':
                        data = yield this.bucket.readXlxs(year + '/' + week + '/wdims.xlsx');
                        date = (0, date_factory_1.nextMondayFromWeek)(week, year); // from fileName ? 
                        const imsData = (0, ims_factory_1.parseIms)(data, date, parseInt(week));
                        const wdData = (0, wd_factory_1.parseWd)(data, date, parseInt(week));
                        yield this.postgres.bulkInsert([imsData], 'immateriele_schade', db, "db1");
                        yield this.postgres.bulkInsert([wdData], 'waardedalingsregeling', db, "db1");
                        break;
                }
                return {
                    msg: "data entry completed successfull"
                };
            }
            catch (err) {
                return {
                    err
                };
            }
        });
    }
    all(week, db) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.entry(week, 'ves', db);
            yield this.entry(week, 'fs', db);
            yield this.entry(week, 'mms', db);
            yield this.entry(week, 'kto', db);
            yield this.entry(week, 'wdims', db);
        });
    }
    validate(jaar_week, topic) {
        return __awaiter(this, void 0, void 0, function* () {
            const year = jaar_week.split("_")[0];
            const week = jaar_week.split("_")[1];
            let data;
            switch (topic) {
                case 'gemeenten':
                    data = yield this.bucket.readFile(year + '/' + week + '/gemeenten.csv');
                    data = (0, csv_factory_1.csvToArray)(data, ",");
                    data = (0, clean_1.cleanGemeenten)(data);
                    break;
                case 'zaaktypes':
                    data = yield this.bucket.readFile(year + '/' + week + '/zaaktypes.csv');
                    data = (0, csv_factory_1.csvToArray)(data, ",");
                    data = (0, clean_1.cleanGemeenten)(data);
                    break;
            }
            return yield (0, validate_1.validateCumulativeTotals)(data);
        });
    }
}
exports.DataController = DataController;
//# sourceMappingURL=data.controller.js.map
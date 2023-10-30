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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbController = void 0;
const postgres_service_1 = require("./postgres.service");
const bucket_service_1 = require("./bucket.service");
const redis_service_1 = require("./redis.service");
const fs_1 = __importDefault(require("fs"));
class DbController {
    constructor() {
        this.bucket = new bucket_service_1.BucketService();
        this.postgres = new postgres_service_1.PostgresService();
        this.redis = new redis_service_1.RedisService();
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.init();
        });
    }
    create(db) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.postgres.create(db);
                yield this.bucket.fetchBackup();
                yield this.postgres.restoreDump(db);
            }
            catch (err) {
                console.log(err);
            }
            return {
                msg: 'created and populated ' + db
            };
        });
    }
    drop(db) {
        return __awaiter(this, void 0, void 0, function* () {
            const success = yield this.postgres.drop(db);
            const msg = (success) ? 'deleted ' + db : 'failed to delete ' + db;
            return { msg };
        });
    }
    update(db) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.drop(db);
            yield this.create(db);
            return {
                msg: 'copied recent backup to ' + db
            };
        });
    }
    backup(db, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = yield this.postgres.dump(db, name);
            const fileStream = yield fs_1.default.createReadStream(path);
            const res = yield this.bucket.writeFile(fileStream, name, db);
            return {
                msg: 'backup for ' + name + "-" + db
            };
        });
    }
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                'LIVE': yield this.redis.read('live_db'),
                'STAGING': yield this.redis.read('staging_db'),
                'NEW': yield this.redis.read('new_db'),
            };
        });
    }
    setDb(name, db) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.write(name, db);
            return yield this.config();
        });
    }
    prepare(db) {
        return __awaiter(this, void 0, void 0, function* () {
            this.redis.write('new_db', db);
            return yield this.update(db);
        });
    }
    import() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    stage() {
        return __awaiter(this, void 0, void 0, function* () {
            // of vaste live db en vaste staging db en dan dump + restore 
        });
    }
    publish() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    addViewToApi(view, db) {
        return __awaiter(this, void 0, void 0, function* () {
            const success = yield this.postgres.addView(view, db);
            const msg = (success) ? 'add public read permissions for ' + view : 'failed to add permissions for ' + view;
            return { msg };
        });
    }
}
exports.DbController = DbController;
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
//# sourceMappingURL=db.controller.js.map
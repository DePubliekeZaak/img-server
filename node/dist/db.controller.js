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
Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};
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
    create(db, source) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.postgres.create(db);
                yield this.bucket.fetchBackup(source);
                yield this.postgres.restoreDump(db, source);
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
            yield this.create(db, "img-backup-latest");
            return {
                msg: 'copied recent backup to ' + db
            };
        });
    }
    backup(db, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const dated_name = `backup_${db}_${now.getWeek()}_${now.getFullYear()}`;
            console.log(dated_name);
            try {
                const path = yield this.postgres.dump(db, name);
                const fileStream = yield fs_1.default.createReadStream(path);
                const res = yield this.bucket.writeFile(fileStream, "img-backup-latest");
                const fileStream_ = yield fs_1.default.createReadStream(path);
                const res_ = yield this.bucket.writeFile(fileStream_, dated_name);
            }
            catch (err) {
                console.log(err);
            }
            return {
                msg: 'backups send to digital ocean for ' + name + ' and ' + dated_name
            };
        });
    }
    prepare(db) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    import() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    upgrade(new_db, destination) {
        return __awaiter(this, void 0, void 0, function* () {
            let success = true;
            try {
                yield this.postgres.dump(new_db, "switch_dump");
                yield this.postgres.disconnect(destination);
                yield this.postgres.drop(destination);
                yield this.postgres.create(destination);
                yield this.postgres.restoreDump(destination, "switch_dump");
            }
            catch (err) {
                console.log("failed to upgrade db");
                success = false;
            }
            return success;
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
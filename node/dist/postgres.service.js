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
exports.PostgresService = void 0;
let success = false;
class PostgresService {
    constructor() {
        this.config = null;
    }
    addView(view, db) {
        return __awaiter(this, void 0, void 0, function* () {
            const cmd = `grant select on api.${view} to web_anon;`;
            return yield this.runPsql(cmd, db);
        });
    }
    disconnect(db) {
        return __awaiter(this, void 0, void 0, function* () {
            const cmd = `SELECT pg_terminate_backend (pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '"${db}"'`;
            return yield this.runPsql(cmd, null);
        });
    }
    drop(db) {
        return __awaiter(this, void 0, void 0, function* () {
            const cmd = `DROP DATABASE IF EXISTS ${db} WITH (FORCE)`;
            return yield this.runPsql(cmd, null);
        });
    }
    create(db) {
        return __awaiter(this, void 0, void 0, function* () {
            const cmd = `CREATE DATABASE ${db}`;
            return yield this.runPsql(cmd, null);
        });
    }
    createWebAnonRole(db) {
        return __awaiter(this, void 0, void 0, function* () {
            const cmd = `create role web_anon nologin`;
            return yield this.runPsql(cmd, db);
        });
    }
    bulkInsert(rows, table, db, instance = 'db1') {
        return __awaiter(this, void 0, void 0, function* () {
            // Get column names from the first row and ensure no trailing comma
            let validColumns = Object.keys(rows[0]).filter(key => rows[0][key] !== undefined && rows[0][key] !== null && rows[0][key] !== '');
            let columns = validColumns.join(", ");
            const INT_MAX = 1000000; // Reasonable cap for regular counts
            const CUMUL_MAX = 10000000; // Reasonable cap for cumulative counts
            const AGE_MAX = 3650; // Reasonable cap for age metrics (10 years in days)
            function checkIntValue(value, isCumulative = false) {
                if (value === null || value === '')
                    return '0';
                try {
                    // Convert scientific notation or large decimals to regular numbers
                    const num = typeof value === 'string' ?
                        (value.includes('e') || value.includes('E') ? 0 : parseInt(value)) :
                        parseInt(value.toString());
                    if (isNaN(num))
                        return '0';
                    // Zero out unreasonably large values
                    const max = isCumulative ? CUMUL_MAX : INT_MAX;
                    return num > max ? '0' : num.toString();
                }
                catch (e) {
                    return '0';
                }
            }
            function checkNumericValue(value, isAge = false) {
                if (value === null || value === '')
                    return '0';
                try {
                    // Convert scientific notation or large decimals to regular numbers
                    const num = typeof value === 'string' ?
                        (value.includes('e') || value.includes('E') ? 0 : parseFloat(value)) :
                        parseFloat(value.toString());
                    if (isNaN(num))
                        return '0';
                    // Cap age values at reasonable maximum
                    if (isAge && num > AGE_MAX) {
                        return AGE_MAX.toString();
                    }
                    return num.toString();
                }
                catch (e) {
                    return '0';
                }
            }
            // Process in chunks of 100 rows to avoid E2BIG error
            const chunkSize = 100;
            let success = true;
            for (let i = 0; i < rows.length; i += chunkSize) {
                const chunk = rows.slice(i, i + chunkSize);
                let string = "INSERT INTO main." + table + " (" + columns + ") VALUES ";
                for (const row of chunk) {
                    string = string.concat("(");
                    for (const key of validColumns) {
                        const value = row[key];
                        if (value === null) {
                            string = string.concat("NULL");
                        }
                        else if (['gemeente', "datum", "pc4", "jaar_week", "datum_maandag", "domein_code", "regeling_code", "zaaktype"].indexOf(key) > -1) {
                            string = string.concat("'" + value + "'");
                        }
                        else if (key.endsWith("_eur") || key === "bz_percentage" || key === "dlt_verwacht_rolling8" || key === "dlt_gerealiseerd_gemiddeld" || key === "dlt_gerealiseerd_mediaan") {
                            string = string.concat(checkNumericValue(value) + "::NUMERIC");
                        }
                        else if (key === "ouderdom_voorraad_gemiddeld" || key === "ouderdom_voorraad_mediaan") {
                            string = string.concat(checkNumericValue(value, true) + "::NUMERIC");
                        }
                        else if (key.endsWith("_aantal") || key === "voorraad_aantal_" || (key.startsWith("ouderdom_voorraad_") && !key.endsWith("gemiddeld") && !key.endsWith("mediaan"))) {
                            string = string.concat(checkIntValue(value, false) + "::INTEGER");
                        }
                        else if (key.endsWith("_cumul")) {
                            string = string.concat(checkIntValue(value, true) + "::INTEGER");
                        }
                        else {
                            string = string.concat(String(value));
                        }
                        string = string.concat(",");
                    }
                    // Remove all trailing commas
                    while (string.endsWith(",")) {
                        string = string.slice(0, -1);
                    }
                    string = string.concat("),");
                }
                // Remove all trailing commas
                while (string.endsWith(",")) {
                    string = string.slice(0, -1);
                }
                string = string.concat(";");
                console.log(`Inserting chunk ${i / chunkSize + 1} of ${Math.ceil(rows.length / chunkSize)}`);
                const result = yield this.runPsql(string, db, instance);
                if (!result) {
                    success = false;
                    break;
                }
            }
            return success;
        });
    }
    insert(data, table, db, instance = 'db1') {
        return __awaiter(this, void 0, void 0, function* () {
            // Convert single insert to bulk insert
            return yield this.bulkInsert([data], table, db, instance);
        });
    }
    update(data, table, key, db) {
        return __awaiter(this, void 0, void 0, function* () {
            function joinValues(data) {
                let string = "";
                for (const [key, value] of Object.entries(data)) {
                    if (['gemeente', "datum", "pc4"].indexOf(key) > -1) {
                        string = string.concat("'" + value + "'");
                    }
                    else {
                        string = string.concat(String(value));
                    }
                    string = string.concat(",");
                }
                return string.slice(0, -1);
            }
            let string = "";
            for (let d of data) {
                if (!isNaN(d.value) && d.value != null) {
                    string = string.concat(`WHEN datum = '${d.date}' THEN ${Math.round(d.value * 1000000)} \n`);
                }
            }
            const vs = data.map(d => { return `'` + d.date + `'`; }).join(',');
            const cmd = `
            UPDATE main.${table} 
            SET sum_verleend = CASE
            ${string}END
            WHERE datum IN (${vs});
        `;
            console.log(cmd);
            return yield this.runPsql(cmd, db);
        });
    }
    dump(db, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const bin = "pg_dump";
            const path = "/tmp/" + name + ".sql";
            const args = [
                "-f",
                path,
                "--host",
                "db1",
                "--dbname",
                db,
                "--username",
                "postgres"
            ];
            yield this.childProcess(bin, args);
            return path;
        });
    }
    restoreDump(db, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const bin = "psql";
            const args = [
                '--host',
                'db1',
                '--username',
                'postgres',
                '-d',
                db,
                '-f',
                `/tmp/${name}.sql`
            ];
            return yield this.childProcess(bin, args);
        });
    }
    importCsv(db, topic) {
        return __awaiter(this, void 0, void 0, function* () {
            const bin = "psql";
            const cmd = `
            COPY main.mms(datum,gemeente,_year,_month,_week,pgv,historie_tcmg_img,historie_nam_cvw,afwijzingen,toekenningen,gemiddeld_verleend)
            FROM '/tmp/` + topic + `.csv'
            DELIMITER ','
            CSV HEADER;
        `;
            const args = [
                '--host',
                'db1',
                '--username',
                'postgres',
                '-d',
                db,
                '-c',
                cmd
            ];
            return yield this.childProcess(bin, args);
        });
    }
    runPsql(cmd, db, instance = 'db1') {
        return __awaiter(this, void 0, void 0, function* () {
            let success = false;
            const bin = "psql";
            try {
                let args = [
                    "--host",
                    instance,
                    "--username",
                    "postgres",
                ];
                if (db !== null) {
                    args = args.concat("-d", db);
                }
                args = args.concat("-c", cmd);
                //console.log(args);
                let res = yield this.childProcess(bin, args);
                success = true;
            }
            catch (err) {
                console.log(err);
            }
            return success;
        });
    }
    childProcess(bin, args) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let output = "";
                const spawn = require('child-process-promise').spawn;
                const promise = spawn('/usr/bin/' + bin, args, { env: { PGPASSWORD: process.env.POSTGRES_PASSWORD } });
                const childProcess = promise.childProcess;
                childProcess.stdout.on('data', function (data) {
                    // console.log('[serve] stdout: ', data.toString());
                    output = output.concat(data.toString());
                });
                childProcess.stderr.on('data', function (data) {
                    console.log('[serve] stderr: ', data.toString());
                    reject(data.toString());
                });
                promise.then(function () {
                    resolve(output);
                })
                    .catch(function (err) {
                    console.error('[spawn] ERROR: ', err);
                    reject(err);
                });
                // is er een soort on exit 
                // child.on('close', exithandler);
            });
        });
    }
}
exports.PostgresService = PostgresService;
//# sourceMappingURL=postgres.service.js.map
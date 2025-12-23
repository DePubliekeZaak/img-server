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
    bulkInsert(rows, table, db, instance = "db1") {
        return __awaiter(this, void 0, void 0, function* () {
            if (!rows || rows.length === 0) {
                return true;
            }
            const validColumns = Object.keys(rows[0]);
            const columns = validColumns.join(", ");
            ``; // String field types for efficient lookup
            const stringFields = new Set([
                "gemeente",
                "datum",
                "pc4",
                "jaar_week",
                "week_vanaf",
                "week_totenmet",
                "domein_code",
                "regeling_code",
                "zaaktype",
                "voorraad_d",
                "laad_dt",
                "jaar_maand",
                "maandnaam",
                "maand_vanaf",
                "maand_totenmet",
            ]);
            const percentageFields = new Set([
                "dlt_verwacht_gemiddeld",
                "dlt_verwacht_mediaan",
                "bz_percentage",
                "dlt_verwacht_rolling8",
                "dlt_gerealiseerd_gemiddeld",
                "dlt_gerealiseerd_mediaan",
                "beschikt_binn_termijn_perc",
                "beschikt_binn_termijn_cumul_perc",
                "toegekend_cumul_perc",
                "bz_cumul_perc",
            ]);
            const averageFields = new Set([
                "ouderdom_voorraad_gemiddeld",
                "ouderdom_voorraad_mediaan",
            ]);
            // Helper function to format value based on field type
            const formatValue = (key, value) => {
                if (value === null || value === undefined || value === "NULL") {
                    return "NULL";
                }
                // Handle NaN values universally first
                if (value === "NaN" || (typeof value === "number" && isNaN(value))) {
                    if (key.endsWith("_eur") ||
                        percentageFields.has(key) ||
                        averageFields.has(key)) {
                        return "0::NUMERIC";
                    }
                    else if (key.endsWith("_aantal") ||
                        key.endsWith("_cumul") ||
                        key === "voorraad_aantal_" ||
                        (key.startsWith("ouderdom_voorraad_") &&
                            !key.endsWith("gemiddeld") &&
                            !key.endsWith("mediaan"))) {
                        return "0::INTEGER";
                    }
                    else {
                        return "0";
                    }
                }
                if (stringFields.has(key)) {
                    if (value === null ||
                        value === undefined ||
                        value === "" ||
                        value === "NULL") {
                        return "NULL";
                    }
                    const cleanValue = String(value).replace(/\r/g, "").replace(/'/g, "''");
                    return `'${cleanValue}'`;
                }
                if (key.endsWith("_eur")) {
                    const numValue = Number(value);
                    if (isNaN(numValue)) {
                        return "0::NUMERIC";
                    }
                    const roundedValue = Math.round(numValue * 100) / 100;
                    return `${roundedValue}::NUMERIC`;
                }
                if (percentageFields.has(key)) {
                    // Remove % character if present before parsing
                    const cleanValue = String(value).replace(/%/g, "");
                    let numValue = parseFloat(cleanValue);
                    if (value === "NaN" ||
                        isNaN(numValue) ||
                        value === null ||
                        value === undefined) {
                        return "0::NUMERIC";
                    }
                    if (key.includes("perc")) {
                        numValue = numValue * 100;
                    }
                    return `${numValue.toFixed(2)}::NUMERIC`;
                }
                if (averageFields.has(key)) {
                    const numValue = Number(value);
                    if (isNaN(numValue)) {
                        return "0::NUMERIC";
                    }
                    return `${numValue}::NUMERIC`;
                }
                if (key.endsWith("_aantal") ||
                    key === "voorraad_aantal_" ||
                    (key.startsWith("ouderdom_voorraad_") &&
                        !key.endsWith("gemiddeld") &&
                        !key.endsWith("mediaan"))) {
                    const intValue = parseInt(value);
                    if (isNaN(intValue)) {
                        return "0::INTEGER";
                    }
                    return `${intValue}::INTEGER`;
                }
                if (key.endsWith("_cumul")) {
                    const intValue = parseInt(value);
                    if (isNaN(intValue)) {
                        return "0::INTEGER";
                    }
                    return `${intValue}::INTEGER`;
                }
                if (key === "beslistermijn_dagen") {
                    const numValue = Number(value);
                    if (isNaN(numValue)) {
                        return "0::INTEGER";
                    }
                    return `${Math.ceil(numValue - 0.5)}::INTEGER`;
                }
                return String(value);
            };
            // Process in larger chunks for better performance
            const chunkSize = 48;
            let success = true;
            for (let i = 0; i < rows.length; i += chunkSize) {
                const chunk = rows.slice(i, i + chunkSize);
                // Build values array more efficiently
                const valueRows = [];
                for (const row of chunk) {
                    const values = validColumns.map((key) => formatValue(key, row[key]));
                    valueRows.push(`(${values.join(", ")})`);
                }
                const sql = `INSERT INTO main.${table} (${columns}) VALUES ${valueRows.join(", ")};`;
                console.log(`Inserting chunk ${Math.floor(i / chunkSize) + 1} of ${Math.ceil(rows.length / chunkSize)} (${chunk.length} rows)`);
                const result = yield this.runPsql(sql, db, instance);
                if (!result) {
                    console.error(`Failed to insert chunk starting at row ${i}`);
                    success = false;
                    break;
                }
            }
            return success;
        });
    }
    insert(data, table, db, instance = "db1") {
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
                    if (["gemeente", "datum", "pc4"].indexOf(key) > -1) {
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
            const vs = data
                .map((d) => {
                return `'` + d.date + `'`;
            })
                .join(",");
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
                "postgres",
            ];
            yield this.childProcess(bin, args);
            return path;
        });
    }
    restoreDump(db, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const bin = "psql";
            const args = [
                "--host",
                "db1",
                "--username",
                "postgres",
                "-d",
                db,
                "-f",
                `/tmp/${name}.sql`,
            ];
            return yield this.childProcess(bin, args);
        });
    }
    importCsv(db, topic) {
        return __awaiter(this, void 0, void 0, function* () {
            const bin = "psql";
            const cmd = `
            COPY main.mms(datum,gemeente,_year,_month,_week,pgv,historie_tcmg_img,historie_nam_cvw,afwijzingen,toekenningen,gemiddeld_verleend)
            FROM '/tmp/` +
                topic +
                `.csv'
            DELIMITER ','
            CSV HEADER;
        `;
            const args = [
                "--host",
                "db1",
                "--username",
                "postgres",
                "-d",
                db,
                "-c",
                cmd,
            ];
            return yield this.childProcess(bin, args);
        });
    }
    runPsql(cmd, db, instance = "db1") {
        return __awaiter(this, void 0, void 0, function* () {
            let success = false;
            const bin = "psql";
            try {
                let args = ["--host", instance, "--username", "postgres"];
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
                const spawn = require("child-process-promise").spawn;
                const promise = spawn("/usr/bin/" + bin, args, {
                    env: { PGPASSWORD: process.env.POSTGRES_PASSWORD },
                });
                const childProcess = promise.childProcess;
                childProcess.stdout.on("data", function (data) {
                    // console.log('[serve] stdout: ', data.toString());
                    output = output.concat(data.toString());
                });
                childProcess.stderr.on("data", function (data) {
                    console.log("[serve] stderr: ", data.toString());
                    reject(data.toString());
                });
                promise
                    .then(function () {
                    resolve(output);
                })
                    .catch(function (err) {
                    console.error("[spawn] ERROR: ", err);
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
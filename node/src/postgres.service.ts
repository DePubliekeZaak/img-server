let success = false;


export interface IPostgresService {

    addView: (view: string, db: string) => Promise<boolean>;
    disconnect: (db: string) => Promise<boolean>;
    drop: (db: string) => Promise<boolean>;
    create: (db: string) => void;
    createWebAnonRole: (db: string) => void;
    insert: (data: any, tablke: string, db: string) => Promise<boolean>;
    dump: (db: string, name: string) => Promise<string>;
    importCsv: (db: string, topic: string) => Promise<string>;
    restoreDump: (db: string, name: string) => Promise<string>;
}

export class PostgresService {

    client: any;
    config: any = null;
    spawn: any;

    constructor() {
    }

    async addView(view: string, db: string) {

        const cmd = `grant select on api.${view} to web_anon;`;
        return await this.runPsql(cmd,db);
    }

    async disconnect(db: string) {

        const cmd = `SELECT pg_terminate_backend (pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '"${db}"'`;
        return await this.runPsql(cmd, null);   
    }

    async drop(db: string) {

        const cmd = `DROP DATABASE IF EXISTS ${db} WITH (FORCE)`;
        return await this.runPsql(cmd, null);   
    }

    async create(db: string) {

        const cmd = `CREATE DATABASE ${db}`;
        return await this.runPsql(cmd, null);  
    }

    async createWebAnonRole(db: string) {

        const cmd = `create role web_anon nologin`;
        return await this.runPsql(cmd, db);
    }

    async insert(data: any, table: string, db: string) {

        function joinValues(data) {

            let string = "";

            for (const [key, value] of Object.entries(data)) {

                if (['gemeente',"datum","pc4"].indexOf(key) > -1)  {
                    string = string.concat("'" + value + "'");
                } else {
                    string = string.concat(String(value));
                }
                string = string.concat(",");
            }

            return string.slice(0,-1);
        }

        const cmd = `
            INSERT INTO main.` + table + `(` + Object.keys(data).join(", ") + `)
            VALUES (` + joinValues(data) + `);
        `;

        // console.log(cmd);
            
        return await this.runPsql(cmd, db);
    }

    async dump(db: string, name: string) {

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

        await this.childProcess(bin,args);
        return path;
    }

    async restoreDump(db: string, name: string) {

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
        ]

        return await this.childProcess(bin,args);
    }

    async importCsv(db: string, topic: string) {

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
        ]

        

        return await this.childProcess(bin, args);
    }

    

    async runPsql(cmd: string, db: string) {

        let success = false;

        const bin = "psql";

        try {
            
            let args = [
                "--host",
                "db1",
                "--username",
                "postgres",
            ]

            if(db !== null) {
                args = args.concat("-d",db);
            }

            args = args.concat("-c",cmd);

            console.log(args);

            let res = await this.childProcess(bin,args);

            success = true;
                
            } catch (err) {
                console.log(err);
            }

        return success;
    }

    async childProcess(bin: string, args: string[]) {

        return new Promise<string>((resolve, reject) => { 

            let output: string = "";

            const spawn = require('child-process-promise').spawn;

            const promise = spawn('/usr/bin/' + bin, args, {env: {PGPASSWORD: process.env.POSTGRES_PASSWORD}});
            const childProcess = promise.childProcess;
        
            childProcess.stdout.on('data', function (data: any) {
                // console.log('[serve] stdout: ', data.toString());
                output = output.concat(data.toString());
            });
        
            childProcess.stderr.on('data', function (data: any) {
                console.log('[serve] stderr: ', data.toString());
                reject(data.toString())
            });

            promise.then(function () {
                resolve(output);
            })
            .catch(function (err) {
                console.error('[spawn] ERROR: ', err);
                reject(err)
            });

            // is er een soort on exit 

            // child.on('close', exithandler);
        });
    }
}
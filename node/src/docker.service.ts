let success = false;


export interface IDockerService {

    drop: (db: string) => Promise<boolean>;
    create: (db: string) => void;
    createWebAnonRole: (db: string) => void;
    importCsv: (db: string, topic: string) => Promise<string>;
    restoreDump: (db: string) => Promise<string>;
}

export class DockerService {

    client: any;
    config: any = null;
    spawn: any;

    constructor() {
    }

    async compose() {

        let success = false;

        try {
            
            const args = [
                "up",
                "-d",
            ]

            let res = await this.childProcess(args);

            success = true;
                
            } catch (err) {
                console.log(err);
            }

        return success;
    }

    async childProcess(args) {

        return new Promise<string>((resolve, reject) => { 

            let output: string = "";

            const spawn = require('child-process-promise').spawn;

            const promise = spawn('/usr/bin/docker-compose', args, {env: {PGPASSWORD: process.env.POSTGRES_PASSWORD}});
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
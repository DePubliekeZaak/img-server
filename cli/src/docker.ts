let success = false;

// import * as dotenv from 'dotenv'
// dotenv.config() 

// type DbConfig = {

//     live_db:string,
//     staging_db: string,
//     new_db: string
// }

export interface IDockerService {

    // drop: (db: string) => Promise<boolean>;
    // create: (db: string) => void;
    // createWebAnonRole: (db: string) => void;
    // connectToDb: (db: string) => void;
    // restoreDump: (db: string) => Promise<void>;
    compose: (db_config: any) => Promise<string>;
}

export class DockerService implements IDockerService {

    client: any;
    config: any = null;
    spawn: any;

    constructor() {
    }

    async compose(db_config: any) {

        const args = [
            '-f',
            '/srv/img-server/docker/docker-compose.yaml',
            'up',
            '-d'
        ]

        return await this.childProcess(args,db_config)
    }

    async childProcess(args: string[], db_config: any) {

        return new Promise<string>((resolve, reject) => { 

            const spawn = require('child-process-promise').spawn;

            const promise = spawn('/usr/bin/docker-compose', args, {env: { ...db_config }});
            const childProcess = promise.childProcess;

            let output = "";
        
            childProcess.stdout.on('data', function (data: any) {
                // console.log('[serve] stdout: ', data.toString());
                output = output + data.toString();
            });
        
            childProcess.stderr.on('data', function (data: any) {
                // console.log('[serve] stderr: ', data.toString());
                output = output + ' ' + data.toString();
                // reject(data.toString())
            });

            setTimeout ( () => {
                resolve(output)
            },10000)

            // resolve("kip");
        });
    }
}
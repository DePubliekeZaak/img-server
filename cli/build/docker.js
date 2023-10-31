let success = false;
export class DockerService {
    constructor() {
        this.config = null;
    }
    async compose(db_config) {
        const args = [
            '-f',
            '/srv/img-server/docker/docker-compose.yaml',
            'up',
            '-d'
        ];
        return await this.childProcess(args, db_config);
    }
    async childProcess(args, db_config) {
        return new Promise((resolve, reject) => {
            const spawn = require('child-process-promise').spawn;
            const promise = spawn('/usr/bin/docker-compose', args, { env: { ...db_config } });
            const childProcess = promise.childProcess;
            let output = "";
            childProcess.stdout.on('data', function (data) {
                // console.log('[serve] stdout: ', data.toString());
                output = output + data.toString();
            });
            childProcess.stderr.on('data', function (data) {
                // console.log('[serve] stderr: ', data.toString());
                output = output + ' ' + data.toString();
                // reject(data.toString())
            });
            setTimeout(() => {
                resolve(output);
            }, 10000);
            // resolve("kip");
        });
    }
}

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
exports.DockerService = void 0;
let success = false;
class DockerService {
    constructor() {
        this.config = null;
    }
    compose() {
        return __awaiter(this, void 0, void 0, function* () {
            let success = false;
            try {
                const args = [
                    "up",
                    "-d",
                ];
                let res = yield this.childProcess(args);
                success = true;
            }
            catch (err) {
                console.log(err);
            }
            return success;
        });
    }
    childProcess(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let output = "";
                const spawn = require('child-process-promise').spawn;
                const promise = spawn('/usr/bin/docker-compose', args, { env: { PGPASSWORD: process.env.POSTGRES_PASSWORD } });
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
exports.DockerService = DockerService;
//# sourceMappingURL=docker.service.js.map
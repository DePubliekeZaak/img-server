"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.BucketService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv = __importStar(require("dotenv"));
const fs_1 = require("fs");
dotenv.config();
class BucketService {
    constructor() {
        this.init();
    }
    init() {
        this.client = new client_s3_1.S3Client({
            forcePathStyle: false,
            endpoint: "https://" + process.env.SPACES_REGION + ".digitaloceanspaces.com",
            region: process.env.SPACES_REGION,
            credentials: {
                accessKeyId: process.env.SPACES_KEY,
                secretAccessKey: process.env.SPACES_SECRET
            }
        });
    }
    fetchBackup() {
        return __awaiter(this, void 0, void 0, function* () {
            const bucketParams = {
                Bucket: "img-dashboard-backups",
                Key: "dbs/img-backup-latest.sql"
            };
            const response = yield this.client.send(new client_s3_1.GetObjectCommand(bucketParams));
            let data = yield this._streamToString(response.Body);
            (0, fs_1.writeFileSync)("/tmp/img-backup-latest.sql", data);
        });
    }
    readFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const bucketParams = {
                Bucket: "img-dashboard-backups",
                Key: "invoer/" + fileName
            };
            const response = yield this.client.send(new client_s3_1.GetObjectCommand(bucketParams));
            return yield this._streamToString(response.Body);
        });
    }
    readXlxs(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const bucketParams = {
                Bucket: "img-dashboard-backups",
                Key: "invoer/" + fileName
            };
            const file = yield this.client.send(new client_s3_1.GetObjectCommand(bucketParams));
            return yield this._streamToBuffer(file.Body);
            // return await xlsx.parse(file.Body);
        });
    }
    writeFile(fileStream, name) {
        return __awaiter(this, void 0, void 0, function* () {
            //  const fileStream = fs.createReadStream(file);
            const input = {
                Body: fileStream,
                Bucket: "img-dashboard-backups",
                Key: "dbs/" + name + ".sql"
            };
            return yield this.client.send(new client_s3_1.PutObjectCommand(input));
        });
    }
    // Function to turn the file's body into a string.
    _streamToString(stream) {
        return __awaiter(this, void 0, void 0, function* () {
            const chunks = [];
            return new Promise((resolve, reject) => {
                stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
                stream.on('error', (err) => reject(err));
                stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
            });
        });
    }
    ;
    _streamToBuffer(stream) {
        return __awaiter(this, void 0, void 0, function* () {
            const chunks = [];
            return new Promise((resolve, reject) => {
                stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
                stream.on('error', (err) => reject(err));
                stream.on('end', () => resolve(Buffer.concat(chunks)));
            });
        });
    }
    ;
}
exports.BucketService = BucketService;
//# sourceMappingURL=bucket.service.js.map
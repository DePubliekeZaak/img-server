import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from 'dotenv';
import { writeFileSync } from "fs";
import xlsx from 'node-xlsx';
dotenv.config() 

export interface IBucketService {

    fetchBackup: (source: string) => void;
    readFile: (fileName: string) => Promise<any>
    readXlxs: (fileName: string) => Promise<any>
    writeFile: (fileStream: any, name: string) => Promise<any>
}


export class BucketService implements IBucketService {

    client;

    constructor() {
        this.init();
    }

    init() {

    
    this.client = new S3Client({
        forcePathStyle: false, // Configures to use subdomain/virtual calling format.
        endpoint: "https://" + process.env.SPACES_REGION + ".digitaloceanspaces.com",
        region: process.env.SPACES_REGION,
        credentials: {
        accessKeyId: process.env.SPACES_KEY,
        secretAccessKey: process.env.SPACES_SECRET
        }
    });
    }

    async fetchBackup(source: string = 'img-backup-latest') {


      const bucketParams = {
        Bucket: "img-dashboard-backups",
        Key: `dbs/${source}.sql`
      };

      const response = await this.client.send(new GetObjectCommand(bucketParams));
      let data = await this._streamToString(response.Body);
      writeFileSync(`/tmp/${source}.sql`, data);

    }

    async readFile(fileName: string) {

      const bucketParams = {
        Bucket: "img-dashboard-backups",
        Key: "invoer/" + fileName
      };

      const response = await this.client.send(new GetObjectCommand(bucketParams));
      return await this._streamToString(response.Body);
    }

    async readXlxs(fileName: string) {

      const bucketParams = {
        Bucket: "img-dashboard-backups",
        Key: "invoer/" + fileName
      };

      const file = await this.client.send(new GetObjectCommand(bucketParams));
      return await this._streamToBuffer(file.Body);
      // return await xlsx.parse(file.Body);
    }

    async writeFile(fileStream: any, name: string) {

    //  const fileStream = fs.createReadStream(file);

      const input = {
        Body: fileStream,
        Bucket: "img-dashboard-backups",
        Key: "dbs/" + name + ".sql"
      };

      return await this.client.send(new PutObjectCommand(input));

    }


// Function to turn the file's body into a string.
  async _streamToString(stream) : Promise<string> {
    const chunks = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  };  

  async _streamToBuffer(stream) : Promise<Buffer> {
    const chunks = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  };  
}



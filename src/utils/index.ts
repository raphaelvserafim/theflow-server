import fs, { existsSync, lstatSync, readdirSync, rmdirSync, unlinkSync } from "fs";
import * as crypto from 'crypto';
import bcrypt from 'bcrypt';
import { PutObjectCommand, GetObjectCommand, S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getEnv } from "@app/config/env";

const { PRIVATE_AWS_KEY, PRIVATE_AWS_ACCESS, AWS_BUCKET, AWS_FILE_VIEWS, } = getEnv();


const clientS3 = new S3Client({
  endpoint: "https://usc1.contabostorage.com",
  region: "US-central",
  credentials: {
    accessKeyId: PRIVATE_AWS_ACCESS,
    secretAccessKey: PRIVATE_AWS_KEY,
  },
  forcePathStyle: true
});

export class Functions {

  static delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms));


  static async uploadStorage(pasta: string, file: Express.Multer.File) {
    try {
      const Key = pasta + "/" + Functions.generateRandomToken(6) + file.originalname;
      const uploadParams = {
        Bucket: AWS_BUCKET,
        Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          "Name": file.originalname,
        }
      };
      const command = new PutObjectCommand(uploadParams);
      await clientS3.send(command);
      return { status: true, file: Key }
    } catch (err) {
      return { status: false, message: err.message }
    }
  }


  static getFileStorage(key: string) {
    return `https://usc1.contabostorage.com/${AWS_FILE_VIEWS}:${AWS_BUCKET}/${key}`;
  }

  static async getFileMetadata(key: string) {
    try {
      const command = new HeadObjectCommand({
        Bucket: AWS_BUCKET,
        Key: key,
      });
      const response = await clientS3.send(command);
      return {
        status: true,
        contentType: response.ContentType,
        metadata: response.Metadata,
      };
    } catch (err) {
      return { status: false, message: err.message };
    }
  }

  /**
   * Deleta a pasta e arquivos dentro da pasta
   * @param path caminho da pasta
   */
  static async deleteFolderRecursive(path: fs.PathLike): Promise<void> {
    if (existsSync(path)) {
      readdirSync(path).forEach(function (file: any) {
        var curPath = path + "/" + file;
        if (lstatSync(curPath).isDirectory()) {
          this.deleteFolderRecursive(curPath);
        } else {
          unlinkSync(curPath);
        }
      });
      rmdirSync(path);
    }
  }

  /**
   * Validar se string e uma URL
   * @param str URL
   * @returns 
   */
  static validURL(str: string): boolean {
    var res = str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null);
  };


  /**
   *  Funcao para gerar Tokens
   * @param length  Tamanho do Token a ser Gerado
   * 
   */
  static generateRandomToken(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  };


  /**
   *  Funcao para gerar numeros aleatorios
   * @param length Tamanho do numero a gerar
   * @returns 
   */
  static generateRandomNumbers(length: number) {
    const randomNumbers: number[] = [];
    for (let i = 0; i < length; i++) {
      const digit = Math.floor(Math.random() * 9) + 1;
      randomNumbers.push(digit);
    }
    const result = randomNumbers.join('');
    return result;
  }


  /**
   * Funcao para criptografar Senha
   * @param password string a ser criptografada
   * @returns hash gerada
   */
  static async encryptPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt(5);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Comparar se a hash e valida mesma senha
   * @param plainPassword string senha
   * @param hashedPassword string hash 
   * @returns retorna true ou false
   */

  static async comparePasswords(plainPassword: string, hashedPassword: string) {
    try {
      const match = await bcrypt.compare(plainPassword, hashedPassword);
      return match;
    } catch (error) {
      throw error;
    }
  }

}
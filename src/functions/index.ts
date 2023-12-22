import fs, { existsSync, lstatSync, readdirSync, rmdirSync, unlinkSync } from "fs";
import * as crypto from 'crypto';
import bcrypt from 'bcrypt';

export class Functions {

  static delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms));

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

  static validURL(str: string): boolean {
    var res = str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null);
  };

  static generateRandomToken(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  };

  static async encryptPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt(5);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      throw error;
    }
  }

  static async comparePasswords(plainPassword: string, hashedPassword: string) {
    try {
      const match = await bcrypt.compare(plainPassword, hashedPassword);
      return match;
    } catch (error) {
      throw error;
    }
  }

}
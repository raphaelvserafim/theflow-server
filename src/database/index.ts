import { Sequelize } from "sequelize";

import { getEnv } from '../config/env';

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = getEnv();

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'mysql'
})

export async function connect() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}



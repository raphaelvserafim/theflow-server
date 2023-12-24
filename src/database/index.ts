import { createPool, Pool, PoolConnection } from 'mysql2/promise';
import { getEnv } from '../config/env';
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = getEnv();

class Database {

  private pool: Pool | null = null;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    try {
      console.log("Initializing database connection pool...");
      this.pool = createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        waitForConnections: true,
        connectionLimit: 0,
        queueLimit: 0
      });
    } catch (error) {
      console.error("Error initializing database connection pool:", error.message);
      throw error;
    }
  }

  /**
   * 
   * @param sql 
   * @param values 
   * @param whereClauses 
   * @returns 
   */
  async query(sql: string, values?: any[], whereClauses: string[] = []): Promise<any> {

    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    if (!this.pool) {
      throw new Error('Database connection pool not initialized.');
    }
    const connection: PoolConnection = await this.pool.getConnection();
    try {
      const [rows] = await connection.execute(sql, values);
      return rows;
    } catch (error) {
      console.error("Error executing query:", error.message);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 
   * @param tableName 
   * @param values 
   * @returns 
   */
  async insert(tableName: string, values: {}): Promise<any> {
    const columns = Object.keys(values).join(', ');
    const placeholders = Object.values(values).map(() => '?').join(', ');
    const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    return await this.query(sql, Object.values(values));
  }


  /**
   * 
   * @param tableName 
   * @param updateValues 
   * @param whereClauses 
   * @param whereClausesValues 
   * @returns 
   */
  async update(tableName: string, updateValues: Record<string, any>, whereClauses: string[] = [], whereClausesValues: string[] = [],): Promise<any> {
    const setClause = Object.keys(updateValues).map(column => `${column} = ?`).join(', ');
    const whereClause = whereClauses.length > 0 ? ` WHERE ${whereClauses.map((clause, index) => {
      const value = whereClausesValues[index];
      return `${clause}${typeof value === 'string' ? `'${value}'` : value}`;
    }).join(' AND ')}` : '';
    const sql = `UPDATE ${tableName} SET ${setClause}${whereClause}`;
    const response = await this.query(sql, Object.values(updateValues));
    if (response.affectedRows > 0) {
      return response.affectedRows;
    } else {
      return 0;
    }
  }

  /**
   * 
   * @param tableName 
   * @param values 
   * @param whereClauses 
   * @returns 
   */
  async select(tableName: string, values: any = [], whereClauses: string[] = []): Promise<any> {
    const sql = `SELECT * FROM ${tableName}`;
    return await this.query(sql, values, whereClauses);
  }

}

export default Database;

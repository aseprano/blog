import { Queryable } from '../Queryable';
import { Connection } from 'mysql2';

export class DBQueryableConnection implements Queryable {
  public constructor(protected readonly connection: Connection) {}

  public async query(sql: string, parameters?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, parameters, (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

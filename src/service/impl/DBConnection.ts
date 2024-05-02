import { DBTransaction } from './DBTransaction';
import { DBQueryableConnection } from './DBQueryableConnection';

export class DBConnection extends DBQueryableConnection {
  public async beginTransaction(): Promise<DBTransaction> {
    await this.query(`START TRANSACTION`);
    return new DBTransaction(this.connection);
  }
}

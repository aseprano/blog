import { DBQueryableConnection } from './DBQueryableConnection';

export class DBTransaction extends DBQueryableConnection {
  public async commit(): Promise<void> {
    return this.query('COMMIT');
  }

  public async rollback(): Promise<void> {
    return this.query('ROLLBACK');
  }
}

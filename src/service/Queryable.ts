export interface Queryable {
  query(sql: string, parameters?: any): Promise<any>;
}

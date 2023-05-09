import AWS from "aws-sdk";
declare class DbService {
    getItemById(tableName: string, partitionKey: string, partitionKeyVal: any): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.DynamoDB.DocumentClient.GetItemOutput, AWS.AWSError>>;
    getAll(tableName: string): Promise<any[]>;
    saveItem(tableName: string, partitionKey: string, partitionKeyVal: any, item: object): Promise<void>;
    updateItem(tableName: string, partitionKey: string, partitionKeyVal: any, updatePatch: any): Promise<void>;
    deleteItem(tableName: string, partitionKey: string, partitionKeyVal: string): Promise<void>;
}
declare const _default: DbService;
export default _default;

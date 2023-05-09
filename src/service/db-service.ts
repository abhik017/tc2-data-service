import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

AWS.config.update({
    "region": process.env.AWS_REGION,
    "accessKeyId": process.env.AWS_ACCESS_KEY,
    "secretAccessKey": process.env.AWS_SECRET
});

const docClient = new AWS.DynamoDB.DocumentClient();

class DbService {
    public async getItemById(tableName: string, partitionKey: string, partitionKeyVal: any) {
        const params = {
            TableName: tableName,
            Key: {
                [partitionKey]: partitionKeyVal,
            }
        };
        return await docClient.get(params, (err) => {
            if (err) {
                console.log("Error in recieving item from DynamoDb", err);
            }
        }).promise();
    }

    public async getAll(tableName: string) {
        const params: any = {
            TableName: tableName
        };
        let items: any[] = [];
        let lastEvaluatedKey = undefined;
        do {
            await docClient.scan(params, (err, data) => {
                if (err) {
                    console.log("Error in scanning the table! ", err);
                } else {
                    items = items.concat(data.Items);
                    lastEvaluatedKey = data.LastEvaluatedKey;
                }
            }).promise();
        } while (lastEvaluatedKey) {
            params.ExclusiveStartKey = lastEvaluatedKey;
        }
        return items;
    }

    public async saveItem(tableName: string, partitionKey: string, partitionKeyVal: any, item: object) {
        const params = {
            TableName: tableName,
            Item: {
                ...item,
                [partitionKey]: partitionKeyVal
            }
        };
        await docClient.put(params, (err,data) => {
            if (err) {
                console.log("Error in saving item to DynamoDb", err);
            } else if (data) {
                console.log("Item saved in DynamoDB");
            }
        }).promise();
    }

    public async updateItem(tableName: string, partitionKey: string, partitionKeyVal: any, updatePatch: any) {
        let updateExpressionString: string = "set";
        const expressionAttributeNames: any = {};
        const expressionAttributeValues: any = {};
        let idx = 0;
        for (let key of Object.keys(updatePatch)) {
            if (idx > 0) {
                updateExpressionString += ","
            }
            updateExpressionString += ` #attrName${idx} = :attrVal${idx}`;
            expressionAttributeNames[`#attrName${idx}`] = key;
            expressionAttributeValues[`:attrVal${idx}`] = updatePatch[key];
            idx++;
        }
        const params = {
            TableName: tableName,
            Key: {
                [partitionKey]: partitionKeyVal
            },
            UpdateExpression: updateExpressionString,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues
        };
        await docClient.update(params, (err, data) => {
            if (err) {
                console.log("Error in saving item to DynamoDB", err);
            } else if (data) {
                console.log("Item updated!");
            }
        }).promise();
    }

    public async deleteItem(tableName: string, partitionKey: string, partitionKeyVal: string) {
        const params = {
            TableName: tableName,
            Key: {
                [partitionKey]: partitionKeyVal
            }
        };
        await docClient.delete(params, (err, data) => {
            if (err) {
                console.log("Error in deleting the item!", err);
            } else if (data) {
                console.log("Item deleted!", partitionKeyVal);
            }
        }).promise();
    }
}

export default new DbService();
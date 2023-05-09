"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
aws_sdk_1.default.config.update({
    "region": process.env.AWS_REGION,
    "accessKeyId": process.env.AWS_ACCESS_KEY,
    "secretAccessKey": process.env.AWS_SECRET
});
const docClient = new aws_sdk_1.default.DynamoDB.DocumentClient();
class DbService {
    getItemById(tableName, partitionKey, partitionKeyVal) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: tableName,
                Key: {
                    [partitionKey]: partitionKeyVal,
                }
            };
            return yield docClient.get(params, (err) => {
                if (err) {
                    console.log("Error in recieving item from DynamoDb", err);
                }
            }).promise();
        });
    }
    getAll(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: tableName
            };
            let items = [];
            let lastEvaluatedKey = undefined;
            do {
                yield docClient.scan(params, (err, data) => {
                    if (err) {
                        console.log("Error in scanning the table! ", err);
                    }
                    else {
                        items = items.concat(data.Items);
                        lastEvaluatedKey = data.LastEvaluatedKey;
                    }
                }).promise();
            } while (lastEvaluatedKey);
            {
                params.ExclusiveStartKey = lastEvaluatedKey;
            }
            return items;
        });
    }
    saveItem(tableName, partitionKey, partitionKeyVal, item) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: tableName,
                Item: Object.assign(Object.assign({}, item), { [partitionKey]: partitionKeyVal })
            };
            yield docClient.put(params, (err, data) => {
                if (err) {
                    console.log("Error in saving item to DynamoDb", err);
                }
                else if (data) {
                    console.log("Item saved in DynamoDB");
                }
            }).promise();
        });
    }
    updateItem(tableName, partitionKey, partitionKeyVal, updatePatch) {
        return __awaiter(this, void 0, void 0, function* () {
            let updateExpressionString = "set";
            const expressionAttributeNames = {};
            const expressionAttributeValues = {};
            let idx = 0;
            for (let key of Object.keys(updatePatch)) {
                if (idx > 0) {
                    updateExpressionString += ",";
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
            yield docClient.update(params, (err, data) => {
                if (err) {
                    console.log("Error in saving item to DynamoDB", err);
                }
                else if (data) {
                    console.log("Item updated!");
                }
            }).promise();
        });
    }
    deleteItem(tableName, partitionKey, partitionKeyVal) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: tableName,
                Key: {
                    [partitionKey]: partitionKeyVal
                }
            };
            yield docClient.delete(params, (err, data) => {
                if (err) {
                    console.log("Error in deleting the item!", err);
                }
                else if (data) {
                    console.log("Item deleted!", partitionKeyVal);
                }
            }).promise();
        });
    }
}
exports.default = new DbService();
//# sourceMappingURL=db-service.js.map
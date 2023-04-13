import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand,PutCommand } from '@aws-sdk/lib-dynamodb' 

const dynamoDbClient = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);
const tableName = process.env.DYNAMODB_TABLE_NAME!;

const rateLimit = Number(process.env.JUSTIFY_WORD_LIMIT!);

// TODO: justifyWordCount , alignLeftWordCount, etc..
export const checkTokenRateLimit = async (token:string, wordCount:number): Promise<boolean> => {
    const params = {
        TableName:tableName,
        Key: { "token": token }
    };

    try {
        const data = await dynamoDb.send(new GetCommand(params));
        const currentWordCount = data?.Item ? data?.Item?.wordCount : 0;

        if (currentWordCount + wordCount > rateLimit) return false;
        
        const now = new Date();
        const hPlus24 = now.setHours(now.getHours() + 24);

        if (!data?.Item) {
            const newItem = {
                TableName: tableName,
                Item: {
                    token,
                    wordCount,
                    created_at: Math.floor(Date.now() / 1000),
                    expires_at: Math.floor(hPlus24 / 1000),
                }
            };
            await dynamoDb.send(new PutCommand(newItem));
        } else {
            const updateParams = {
                TableName: tableName,
                Key: {"token": token},
                UpdateExpression: "set wordCount = :wc",
                ExpressionAttributeValues: {":wc": currentWordCount + wordCount},
                ReturnValues: "UPDATED_NEW"
            };
            await dynamoDb?.send(new UpdateCommand(updateParams));
        }
        
        return true;

    } catch (e) {
        console.error(e);
        throw new Error("Error updating rate limit");
    }
}
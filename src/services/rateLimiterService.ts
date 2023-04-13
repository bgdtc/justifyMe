import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand,PutCommand } from '@aws-sdk/lib-dynamodb' 

const dynamoDbClient = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);
const tableName = process.env.DYNAMODB_TABLE_NAME!;

const rateLimit = Number(process.env.JUSTIFY_WORD_LIMIT!);
const now = new Date();
const hPlus24 = now.setHours(now.getHours() + 24);

export const checkTokenRateLimit = async (token:string, wordCount:number): Promise<boolean> => {
    const params = {
        TableName:tableName,
        Key: { "token": token }
    };

    try {
        const data = await dynamoDb.send(new GetCommand(params));
        const currentWordCount = data?.Item ? data?.Item?.wordCount : 0;

        if (currentWordCount + wordCount > rateLimit) return false;
        
        if (!data?.Item) {
           throw new Error('Illegal token');
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
        throw new Error("Error updating rate limit"+e);
    }
}

export const insertTokenIntoDb = async (token:string): Promise<boolean> => {
    try {
        const newItem = {
            TableName: tableName,
            Item: {
                token,
                wordCount: 0,
                created_at: Math.floor(Date.now() / 1000),
                expires_at: Math.floor(hPlus24 / 1000),
            }
        };
        await dynamoDb.send(new PutCommand(newItem));
        return true;
    } catch (e) {
        throw new Error('Error inserting token into db'+e)
    }
}
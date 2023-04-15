import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand,PutCommand,QueryCommand } from '@aws-sdk/lib-dynamodb' 
import { verifyJwt } from './cryptoService';
import { tableName,rateLimit,hPlus24 } from '../utils';

const dynamoDbClient = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);

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
        return false;
    }
};

export const insertTokenIntoDb = async (token:string,secret?:string): Promise<boolean> => {
    try {
        const decodedToken:any = await verifyJwt(token,secret);
        const lookForEmailParams = {
            TableName:tableName,
            IndexName: 'email',
            KeyConditionExpression:'email = :email',
            ExpressionAttributeValues: {
                ":email": decodedToken?.email 
            }
        };

        const emailInTheDb = await dynamoDb.send(new QueryCommand(lookForEmailParams));

        if (emailInTheDb?.Count !== 0) throw new Error('A token already exists for this email');

        const newItem = {
            TableName: tableName,
            Item: {
                token,
                wordCount: 0,
                created_at: Math.floor(Date.now() / 1000),
                expires_at: Math.floor(hPlus24 / 1000),
                email: decodedToken?.email
            }
        };
        await dynamoDb.send(new PutCommand(newItem));
        return true;
    } catch (e) {
        return false;
    }
};
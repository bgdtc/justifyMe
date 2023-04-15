import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient,GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { checkTokenRateLimit,insertTokenIntoDb } from '../services';
import jwt from 'jsonwebtoken';

const dbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {dbMock.reset()});

describe('Check token rate limit tests', () => {
    it ('should return true if the token word count is within the limit',async () => {
        dbMock.on(GetCommand).resolves({Item: { token:"testToken", wordCount: 0 }})
        const isRateLimitOk = await checkTokenRateLimit('testToken', 1000);
        expect(isRateLimitOk).toBe(true);
    });

    it ('should return false if the token word count is above the limit', async () => {
        dbMock.on(GetCommand).resolves({Item: { token: "testToken", wordCount: 80000 }});
        const isRateLimitOk = await checkTokenRateLimit('testToken',100);
        expect(isRateLimitOk).toBe(false);
    });

    it('should throw an error if the token is not in the db', async () => {
        dbMock.on(GetCommand).resolves({Item:undefined});
        const isRateLimitOk = await checkTokenRateLimit('testToken',100);
        expect(isRateLimitOk).toThrowError;
    });
});

describe('Insert token intoDb tests', () => {
    it('should throw an error if the email in the token is already in the db', async() => {
        dbMock.on(QueryCommand).resolves({Count: 1});
        const token = jwt.sign({email:'test@test.test'},'testSecret');
        const tokenEmailNotAlreadyInDb = await insertTokenIntoDb(token,'testSecret');
        expect(tokenEmailNotAlreadyInDb).toBe(false);
    });

    it('should return true if the token word count has been correctly updated', async () => {
        dbMock.on(QueryCommand).resolves({Count: 0});
        const token = jwt.sign({email:'test@test.test'},'testSecret');
        const isTokenEmailNotAlreadyInDb = await insertTokenIntoDb(token,'testSecret');
        expect(isTokenEmailNotAlreadyInDb).toBe(true);
    });
});

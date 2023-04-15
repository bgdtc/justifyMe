export const mailRgx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const tableName = process.env.DYNAMODB_TABLE_NAME! || 'TokensRateLimit' ;
export const rateLimit = Number(process.env.JUSTIFY_WORD_LIMIT! || 80000);
export const now = new Date();
export const hPlus24 = now.setHours(now.getHours() + 24);
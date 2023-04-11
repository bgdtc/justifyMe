import  serverless from 'serverless-http';
import express from 'express';
import router from './router';

const app = express();

app.use('/api', router);


module.exports.handler = serverless(app);
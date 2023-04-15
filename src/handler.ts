import serverless from "serverless-http";
import express from "express";
import router from "./router";
import bodyParser from 'body-parser';
const app = express();

app.use(bodyParser.urlencoded());

app.use("/api", router);

module.exports.handler = serverless(app);

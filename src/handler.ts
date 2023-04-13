import serverless from "serverless-http";
import express from "express";
import router from "./router";

const app = express();

app.use(express.json());

app.use("/api", router);

module.exports.handler = serverless(app);

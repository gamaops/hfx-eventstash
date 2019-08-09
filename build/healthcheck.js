"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv-defaults').config();
const client_1 = __importDefault(require("./client"));
const logger_1 = require("./logger");
const client = client_1.default({
    uri: process.env.EVENTSTASH_RPC_URI,
});
client.health.checkAsync({}).then((response) => {
    if (response.status === 'SERVING') {
        process.exit(0);
    }
    process.exit(1);
}).catch((error) => {
    logger_1.logger.error(error);
    process.exit(1);
});

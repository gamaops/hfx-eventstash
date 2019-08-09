"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../../logger");
exports.isLogstashHealthy = async () => {
    const requestOptions = {
        timeout: parseInt(process.env.LOGSTASH_HEALTHCHECK_TIMEOUT || '5000'),
        responseType: 'json'
    };
    try {
        const processResponse = await axios_1.default.get('http://127.0.0.1:9600/_node/stats/process', requestOptions);
        const eventsResponse = await axios_1.default.get('http://127.0.0.1:9600/_node/stats/events', requestOptions);
        logger_1.logger.info(processResponse.data, 'Logstash process stats response');
        logger_1.logger.info(eventsResponse.data, 'Logstash events stats response');
    }
    catch (error) {
        logger_1.logger.error(error, 'Logstash healthcheck error');
        return false;
    }
    return true;
};

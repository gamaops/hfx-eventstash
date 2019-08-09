"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logstash_1 = require("../logstash");
exports.check = async () => {
    const healthy = await logstash_1.isLogstashHealthy();
    return {
        status: healthy ? 'SERVING' : 'NOT_SERVING',
    };
};
exports.default = () => (call, callback) => {
    exports.check()
        .then((response) => callback(null, response))
        .catch((error) => {
        callback(error, null);
    });
};

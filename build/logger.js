"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan_1 = __importDefault(require("bunyan"));
let LOG_LEVEL = 'debug';
switch (process.env.LOG_LEVEL) {
    case 'info':
        LOG_LEVEL = 'info';
        break;
    case 'debug':
        LOG_LEVEL = 'debug';
        break;
    case 'error':
        LOG_LEVEL = 'error';
        break;
    case 'warn':
        LOG_LEVEL = 'warn';
        break;
}
exports.logger = bunyan_1.default.createLogger({
    name: 'eventstash',
    level: LOG_LEVEL,
});

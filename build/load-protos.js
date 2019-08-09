"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const protobufjs_1 = require("protobufjs");
const logger_1 = require("./logger");
exports.loadProtos = () => {
    const PROTOS_PATH = path_1.default.isAbsolute(process.env.PROTOS_GLOB)
        ? process.env.PROTOS_GLOB
        : path_1.default.join(process.cwd(), process.env.PROTOS_GLOB);
    logger_1.logger.info(`Loading protos from: ${PROTOS_PATH}`);
    const protoFiles = glob_1.default.sync(PROTOS_PATH, {
        nodir: true,
        absolute: true,
    });
    logger_1.logger.debug(protoFiles, 'Protos to be loaded');
    return protobufjs_1.loadSync(protoFiles);
};

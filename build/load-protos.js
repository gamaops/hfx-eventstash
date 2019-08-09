"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const protobufjs_1 = require("protobufjs");
const logger_1 = require("./logger");
const grpc_1 = __importDefault(require("grpc"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
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
exports.getGrpcProtoDescriptor = () => {
    const packageDefinition = protoLoader.loadSync([
        'eventstash.proto',
        'healthcheck.proto'
    ].map((file) => path_1.default.join(__dirname, '../lib', file)), {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
    return grpc_1.default.loadPackageDefinition(packageDefinition);
};

"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protoLoader = __importStar(require("@grpc/proto-loader"));
const grpc_1 = __importDefault(require("grpc"));
const path_1 = __importDefault(require("path"));
exports.getGrpcProtoDescriptor = () => {
    const packageDefinition = protoLoader.loadSync([
        'eventstash.proto',
        'healthcheck.proto',
    ].map((file) => path_1.default.join(__dirname, '../lib', file)), {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });
    return grpc_1.default.loadPackageDefinition(packageDefinition);
};

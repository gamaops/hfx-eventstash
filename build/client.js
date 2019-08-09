"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc_1 = __importDefault(require("grpc"));
const util_1 = __importDefault(require("util"));
const load_grpc_1 = require("./load-grpc");
exports.default = ({ uri, }) => {
    const protoDescriptor = load_grpc_1.getGrpcProtoDescriptor();
    const EventStash = protoDescriptor.hfx.v1.EventStash;
    const Health = protoDescriptor.grpc.health.v1.Health;
    const eventStash = new EventStash(uri, grpc_1.default.credentials.createInsecure());
    const health = new Health(uri, grpc_1.default.credentials.createInsecure());
    Reflect.set(health, 'checkAsync', util_1.default.promisify(health.check.bind(health)));
    return {
        eventStash,
        health,
    };
};

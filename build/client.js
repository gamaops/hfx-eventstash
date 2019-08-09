"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv-defaults').config();
const grpc_1 = __importDefault(require("grpc"));
const load_protos_1 = require("./load-protos");
const util_1 = __importDefault(require("util"));
;
exports.default = ({ uri }) => {
    const protoDescriptor = load_protos_1.getGrpcProtoDescriptor();
    const EventStash = Reflect.get(protoDescriptor.hfx, 'EventStash');
    const Health = Reflect.get(protoDescriptor.google, 'health').v1.Health;
    const eventStash = new EventStash(uri, grpc_1.default.credentials.createInsecure());
    const health = new Health(uri, grpc_1.default.credentials.createInsecure());
    eventStash.storeEventAsync = util_1.default.promisify(eventStash.storeEvent.bind(eventStash));
    health.checkAsync = util_1.default.promisify(health.check.bind(health));
    return {
        eventStash,
        health
    };
};

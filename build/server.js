"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv-defaults').config();
const grpc_1 = __importDefault(require("grpc"));
const logger_1 = require("./logger");
const logstash_1 = require("./logstash");
const eventstash_1 = __importDefault(require("./services/eventstash"));
const health_1 = __importDefault(require("./services/health"));
const load_protos_1 = require("./load-protos");
const logstash = logstash_1.spawnLogstash();
const protoDescriptor = load_protos_1.getGrpcProtoDescriptor();
const hfxV1 = Reflect.get(protoDescriptor.hfx, 'v1');
const googleHealthV1 = Reflect.get(protoDescriptor.google, 'health').v1;
const server = new grpc_1.default.Server();
server.addService(hfxV1.EventStash.service, eventstash_1.default({
    logstash
}));
server.addService(googleHealthV1.Health.service, health_1.default());
process.once('SIGTERM', () => {
    const timeout = parseInt(process.env.SHUTDOWN_TIMEOUT);
    logger_1.logger.warn({ timeout }, 'Received SIGTERM, starting to shutdown');
    let closedServer = false;
    let closedLogstash = false;
    let timeoutId = setTimeout(() => {
        logger_1.logger.error('Deadline reached to shutdown');
        if (!closedServer) {
            logger_1.logger.error('Forcing server to shutdown');
            server.forceShutdown();
        }
        if (!closedLogstash) {
            logger_1.logger.error('Forcing logstash to shutdown');
            logstash.removeAllListeners('exit');
            logstash.kill('SIGINT');
        }
        process.exit(1);
    }, timeout);
    server.tryShutdown(() => {
        logger_1.logger.warn('Server shutdown');
        closedServer = true;
        logstash.once('exit', () => {
            closedLogstash = true;
            clearTimeout(timeoutId);
            process.exit(0);
        });
        logstash.kill('SIGTERM');
    });
});
server.bind(process.env.GRPC_BIND_ADDRESS, grpc_1.default.ServerCredentials.createInsecure());
server.start();

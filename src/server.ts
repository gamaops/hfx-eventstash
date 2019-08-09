require('dotenv-defaults').config();

import grpc from 'grpc';
import { logger } from './logger';
import { spawnLogstash } from './logstash';
import EventStashService from './services/eventstash';
import HealthService from './services/health';
import { getGrpcProtoDescriptor } from './load-grpc';

const logstash = spawnLogstash();
const protoDescriptor = getGrpcProtoDescriptor();
const hfxV1: any = Reflect.get(protoDescriptor.hfx, 'v1');
const grpcHealthV1: any = Reflect.get(protoDescriptor.grpc, 'health').v1;
const server = new grpc.Server();

server.addService(hfxV1.EventStash.service, EventStashService({
	logstash
}));

server.addService(grpcHealthV1.Health.service, HealthService());

const makeCloseListener = (signal: string) => () => {
	const timeout: number = parseInt(process.env.SHUTDOWN_TIMEOUT!);
	logger.warn({timeout}, `Received ${signal}, starting to shutdown`);

	let closedServer: boolean = false;
	let closedLogstash: boolean = false;
	let timeoutId: any = setTimeout(() => {
		logger.error('Deadline reached to shutdown');
		if (!closedServer) {
			logger.error('Forcing server to shutdown');
			server.forceShutdown();
		}
		if (!closedLogstash) {
			logger.error('Forcing logstash to shutdown');
			logstash.removeAllListeners('exit');
			logstash.kill('SIGINT');
		}
		process.exit(1);
	}, timeout);
	
	server.tryShutdown(() => {
		logger.warn('Server shutdown');
		closedServer = true;
		logstash.once('exit', () => {
			closedLogstash = true;
			clearTimeout(timeoutId);
			process.exit(0);
		});
		logstash.kill('SIGTERM');
	});
};
process.once('SIGTERM', makeCloseListener('SIGTERM'));
process.once('SIGINT', makeCloseListener('SIGINT'));

server.bind(process.env.GRPC_BIND_ADDRESS!, grpc.ServerCredentials.createInsecure());
server.start();
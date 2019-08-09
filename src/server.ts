require('dotenv-defaults').config();

import grpc from 'grpc';
import { getGrpcProtoDescriptor } from './load-grpc';
import { logger } from './logger';
import { spawnLogstash } from './logstash';
import EventStashService from './services/eventstash';
import HealthService from './services/health';

const logstash = spawnLogstash();
const protoDescriptor = getGrpcProtoDescriptor();
const { EventStash } = protoDescriptor.hfx.v1;
const { Health } = protoDescriptor.grpc.health.v1;
const server = new grpc.Server();

server.addService(EventStash.service, EventStashService({
	logstash,
}));

server.addService(Health.service, HealthService());

export const makeCloseListener = (signal: string) => () => {
	const timeout: number = parseInt(process.env.SHUTDOWN_TIMEOUT!);
	logger.warn({timeout}, `Received ${signal}, starting to shutdown`);

	let closedServer: boolean = false;
	let closedLogstash: boolean = false;
	const timeoutId: any = setTimeout(() => {
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

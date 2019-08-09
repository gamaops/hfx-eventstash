import grpc from 'grpc';
import util from 'util';
import { IEventStashClient } from './interfaces/eventstash';
import { IHealthClientAsync } from './interfaces/healthcheck';
import { getGrpcProtoDescriptor  } from './load-grpc';

export interface IEventStashClientOptions {
	uri: string;
}

export interface IPackageClient {
	eventStash: IEventStashClient;
	health: IHealthClientAsync;
}

export default ({
	uri,
}: IEventStashClientOptions): IPackageClient => {

	const protoDescriptor = getGrpcProtoDescriptor();
	const EventStash = protoDescriptor.hfx.v1.EventStash;
	const Health = protoDescriptor.grpc.health.v1.Health;
	const eventStash = new EventStash(uri, grpc.credentials.createInsecure());
	const health = new Health(uri, grpc.credentials.createInsecure());

	Reflect.set(health, 'checkAsync', util.promisify(health.check.bind(health)));

	return {
		eventStash,
		health,
	} as IPackageClient;

};

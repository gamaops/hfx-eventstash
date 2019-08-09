import grpc from 'grpc';
import { getGrpcProtoDescriptor  } from './load-grpc';
import util from 'util';

export interface IEventStashClientOptions {
	uri: string
};

export default ({
	uri
}: IEventStashClientOptions) => {

	const protoDescriptor = getGrpcProtoDescriptor();
	const EventStash: any = Reflect.get(protoDescriptor.hfx, 'v1').EventStash;
	const Health: any = Reflect.get(protoDescriptor.grpc, 'health').v1.Health;
	const eventStash = new EventStash(uri, grpc.credentials.createInsecure());
	const health = new Health(uri, grpc.credentials.createInsecure());
	
	eventStash.storeEventAsync = util.promisify(eventStash.storeEvent.bind(eventStash));
	health.checkAsync = util.promisify(health.check.bind(health));

	return {
		eventStash,
		health
	};

};

import path from 'path';
import grpc from 'grpc';
import * as protoLoader from '@grpc/proto-loader';

export const getGrpcProtoDescriptor = () => {
	const packageDefinition = protoLoader.loadSync(
		[
			'eventstash.proto',
			'healthcheck.proto'
		].map((file) => path.join(__dirname, '../lib', file)),
		{
			keepCase: true,
			longs: String,
			enums: String,
			defaults: true,
			oneofs: true
		}
	);
	return grpc.loadPackageDefinition(packageDefinition);
};
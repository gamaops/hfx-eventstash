
import * as protoLoader from '@grpc/proto-loader';
import grpc from 'grpc';
import path from 'path';
import { IPackageDefinition } from './interfaces/grpc';

export const getGrpcProtoDescriptor = (): IPackageDefinition => {
	const packageDefinition = protoLoader.loadSync(
		[
			'eventstash.proto',
			'healthcheck.proto',
		].map((file) => path.join(__dirname, '../lib', file)),
		{
			keepCase: true,
			longs: String,
			enums: String,
			defaults: true,
			oneofs: true,
		},
	);
	return grpc.loadPackageDefinition(packageDefinition) as any as IPackageDefinition;
};

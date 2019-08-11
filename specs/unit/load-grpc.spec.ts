import { expect } from 'chai';
import sinon from 'sinon';

declare const requireUncached: any;
declare const mockUncached: any;

describe(
	'load-grpc',
	() => {

		let protoLoader: any;
		let loadGrpc: any;
		let grpc: any;

		beforeEach(
			() => {

				protoLoader = {
					loadSync: sinon.stub(),
				};

				grpc = {
					loadPackageDefinition: sinon.stub(),
				};

				mockUncached('grpc', grpc);
				mockUncached('@grpc/proto-loader', protoLoader);

				loadGrpc = requireUncached('@src/load-grpc.ts');

			},
		);

		it(
			'Should export object',
			() => {
				expect(loadGrpc).to.be.an('object');
				expect(loadGrpc.getGrpcProtoDescriptor).to.be.a('function');
			},
		);

		describe(
			'getGrpcProtoDescriptor',
			() => {

				it(
					'Should load proto descriptor',
					() => {

						const packageDefinition = Symbol();
						const protoDescriptor = Symbol();

						protoLoader.loadSync.returns(packageDefinition);
						grpc.loadPackageDefinition.returns(protoDescriptor);

						expect(loadGrpc.getGrpcProtoDescriptor()).to.be.equal(protoDescriptor);

						let callArgs: any;

						sinon.assert.calledOnce(protoLoader.loadSync);

						sinon.assert.calledOnce(grpc.loadPackageDefinition);
						callArgs = grpc.loadPackageDefinition.getCall(0).args;
						expect(callArgs[0]).to.be.equal(packageDefinition);

					},
				);

			},
		);

	},
);

import { expect } from 'chai';
import sinon from 'sinon';

declare const requireUncached: any;
declare const mockUncached: any;

describe(
	'client',
	() => {

		let makeClient: any;
		let grpc: any;
		let util: any;
		let getGrpcProtoDescriptor: any;
		let protoDescriptor: any;
		let healthInstance: any;

		beforeEach(
			() => {

				util = {
					promisify: sinon.stub(),
				};

				healthInstance = {
					check: sinon.stub(),
				};

				protoDescriptor = {
					hfx: {
						v1: {
							EventStash: sinon.stub(),
						},
					},
					grpc: {
						health: {
							v1: {
								Health: sinon.stub().returns(healthInstance),
							},
						},
					},
				};

				getGrpcProtoDescriptor = sinon.stub().returns(protoDescriptor);

				grpc = {
					credentials: {
						createInsecure: sinon.stub(),
					},
				};

				mockUncached('grpc', grpc);
				mockUncached('util', util);
				mockUncached('@src/load-grpc.ts', {getGrpcProtoDescriptor});

				makeClient = requireUncached('@src/client.ts').default;

			},
		);

		it(
			'Should export a function',
			() => {
				expect(makeClient).to.be.a('function');
			},
		);

		describe(
			'makeClient',
			() => {

				it(
					'Should make a client',
					() => {

						const uri = Symbol();
						const credentials = Symbol();

						grpc.credentials.createInsecure.returns(credentials);

						const result = makeClient({uri});

						expect(result).to.be.an('object');
						expect(result.eventStash).to.be.instanceOf(
							protoDescriptor.hfx.v1.EventStash,
						);
						expect(result.health).to.be.equal(healthInstance);

						let callArgs: any;

						sinon.assert.calledOnce(getGrpcProtoDescriptor);
						sinon.assert.calledOnce(util.promisify);
						sinon.assert.calledTwice(grpc.credentials.createInsecure);

						sinon.assert.calledOnce(protoDescriptor.hfx.v1.EventStash);
						callArgs = protoDescriptor.hfx.v1.EventStash.getCall(0).args;
						expect(callArgs[0]).to.be.equal(uri);
						expect(callArgs[1]).to.be.equal(credentials);

						sinon.assert.calledOnce(protoDescriptor.grpc.health.v1.Health);
						callArgs = protoDescriptor.grpc.health.v1.Health.getCall(0).args;
						expect(callArgs[0]).to.be.equal(uri);
						expect(callArgs[1]).to.be.equal(credentials);

					},
				);

			},
		);

	},
);

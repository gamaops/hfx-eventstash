import { expect } from 'chai';
import sinon from 'sinon';

declare const requireUncached: any;
declare const mockUncached: any;

describe(
	'server',
	() => {

		let grpc: any;
		let getGrpcProtoDescriptor: any;
		let logger: any;
		let protoDescriptor: any;
		let serverInstance: any;
		let spawnLogstash: any;
		let logstash: any;
		let EventStashService: any;
		let HealthService: any;
		let server: any;

		beforeEach(
			() => {

				process.env.GRPC_BIND_ADDRESS = 'bindaddress';
				process.env.SHUTDOWN_TIMEOUT = '0';

				logger = {
					info: sinon.stub(),
					warn: sinon.stub(),
					error: sinon.stub(),
					child: sinon.stub().returns(logger),
				};

				protoDescriptor = {
					hfx: {
						v1: {
							EventStash: {
								service: Symbol(),
							},
						},
					},
					grpc: {
						health: {
							v1: {
								Health: {
									service: Symbol(),
								},
							},
						},
					},
				};

				getGrpcProtoDescriptor = sinon.stub().returns(protoDescriptor);

				serverInstance = {
					addService: sinon.stub(),
					bind: sinon.stub(),
					start: sinon.stub(),
					tryShutdown: sinon.stub(),
					forceShutdown: sinon.stub(),
				};

				grpc = {
					Server: sinon.stub().returns(serverInstance),
					ServerCredentials: {
						createInsecure: sinon.stub().returns('credentials'),
					},
				};

				logstash = {
					once: sinon.stub(),
					kill: sinon.stub(),
					removeAllListeners: sinon.stub(),
				};

				spawnLogstash = sinon.stub().returns(logstash);

				HealthService = sinon.stub().returns('HealthService');
				EventStashService = sinon.stub().returns('EventStashService');

				mockUncached('grpc', grpc);
				mockUncached('@src/services/eventstash/index.ts', EventStashService);
				mockUncached('@src/services/health/index.ts', HealthService);
				mockUncached('@src/logstash.ts', {spawnLogstash});
				mockUncached('@src/logger.ts', {logger});
				mockUncached('@src/load-grpc.ts', {getGrpcProtoDescriptor});

				server = requireUncached('@src/server.ts');

			},
		);

		it(
			'Should export object and start server',
			() => {
				expect(server).to.be.an('object');
				expect(server.makeCloseListener).to.be.a('function');

				sinon.assert.calledOnce(spawnLogstash);
				sinon.assert.calledOnce(getGrpcProtoDescriptor);
				sinon.assert.calledOnce(grpc.Server);
				sinon.assert.calledOnce(grpc.ServerCredentials.createInsecure);
				sinon.assert.calledOnce(serverInstance.bind);
				sinon.assert.calledOnce(serverInstance.start);
				sinon.assert.calledOnce(EventStashService);
				sinon.assert.calledOnce(HealthService);
				sinon.assert.calledTwice(serverInstance.addService);

				let callArgs: any;

				callArgs = serverInstance.bind.getCall(0).args;
				expect(callArgs[0]).to.be.equal('bindaddress');
				expect(callArgs[1]).to.be.equal('credentials');

				callArgs = serverInstance.addService.getCall(0).args;
				expect(callArgs[0]).to.be.equal(protoDescriptor.hfx.v1.EventStash.service);
				expect(callArgs[1]).to.be.equal('EventStashService');

				callArgs = serverInstance.addService.getCall(1).args;
				expect(callArgs[0]).to.be.equal(protoDescriptor.grpc.health.v1.Health.service);
				expect(callArgs[1]).to.be.equal('HealthService');

			},
		);

	},
);

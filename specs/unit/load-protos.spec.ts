import { expect } from 'chai';
import sinon from 'sinon';

declare const requireUncached: any;
declare const mockUncached: any;

describe(
	'load-protos',
	() => {

		let loadProtos: any;
		let glob: any;
		let path: any;
		let protobufjs: any;
		let logger: any;

		beforeEach(
			() => {

				logger = {
					info: sinon.stub(),
					debug: sinon.stub(),
				};

				glob = {
					sync: sinon.stub(),
				};

				protobufjs = {
					loadSync: sinon.stub(),
				};

				path = {
					isAbsolute: sinon.stub(),
					join: sinon.stub(),
				};

				mockUncached('protobufjs', protobufjs);
				mockUncached('glob', glob);
				mockUncached('path', path);
				mockUncached('@src/logger.ts', {logger});

				loadProtos = requireUncached('@src/load-protos.ts');

			},
		);

		it(
			'Should export object',
			() => {
				expect(loadProtos).to.be.an('object');
				expect(loadProtos.loadProtos).to.be.a('function');
			},
		);

		describe(
			'loadProtos',
			() => {

				it(
					'Should load proto definitions',
					() => {

						const protosPath = 'protospath';
						const protoFiles = Symbol();
						const protos = Symbol();

						path.isAbsolute.returns(false);
						path.join.returns(protosPath);
						glob.sync.returns(protoFiles);
						protobufjs.loadSync.returns(protos);

						process.env.PROTOS_GLOB = 'protosglob';

						expect(loadProtos.loadProtos()).to.be.equal(protos);

						let callArgs: any;

						sinon.assert.calledOnce(path.join);
						callArgs = path.join.getCall(0).args;
						expect(callArgs[0]).to.be.a('string');
						expect(callArgs[1]).to.be.equal('protosglob');

						sinon.assert.calledOnce(path.isAbsolute);
						callArgs = path.isAbsolute.getCall(0).args;
						expect(callArgs[0]).to.be.equal('protosglob');

						sinon.assert.calledOnce(glob.sync);
						callArgs = glob.sync.getCall(0).args;
						expect(callArgs[0]).to.be.equal(protosPath);

						sinon.assert.calledOnce(protobufjs.loadSync);
						callArgs = protobufjs.loadSync.getCall(0).args;
						expect(callArgs[0]).to.be.equal(protoFiles);

						sinon.assert.calledOnce(logger.info);
						callArgs = logger.info.getCall(0).args;
						expect(callArgs[0]).to.be.a('string');

						sinon.assert.calledOnce(logger.debug);
						callArgs = logger.debug.getCall(0).args;
						expect(callArgs[0]).to.be.equal(protoFiles);
						expect(callArgs[1]).to.be.a('string');

					},
				);

			},
		);

	},
);

import { expect } from 'chai';
import sinon from 'sinon';

declare const requireUncached: any;
declare const mockUncached: any;

describe(
	'healthcheck',
	() => {

		let makeClient: any;
		let logger: any;
		let client: any;
		let mockedPromise: any;

		beforeEach(
			() => {

				process.env.EVENTSTASH_RPC_URI = 'grpcuri';

				mockedPromise = {};
				mockedPromise.then = sinon.stub().returns(mockedPromise);
				mockedPromise.catch = sinon.stub().returns(mockedPromise);

				client = {
					health: {
						checkAsync: sinon.stub().returns(mockedPromise),
					},
				};

				makeClient = sinon.stub().returns(client);

				logger = {
					error: sinon.stub(),
				};

				mockUncached('@src/client.ts', makeClient);
				mockUncached('@src/logger.ts', {logger});

				requireUncached('@src/healthcheck.ts');

			},
		);

		it(
			'Should do a healthcheck',
			() => {
				let callArgs: any;

				sinon.assert.calledOnce(makeClient);
				callArgs = makeClient.getCall(0).args;
				expect(callArgs[0]).to.be.an('object');
				expect(callArgs[0].uri).to.be.equal('grpcuri');

				sinon.assert.calledOnce(client.health.checkAsync);
				callArgs = client.health.checkAsync.getCall(0).args;
				expect(callArgs[0]).to.be.an('object');

				sinon.assert.calledOnce(mockedPromise.then);
				callArgs = mockedPromise.then.getCall(0).args;
				expect(callArgs[0]).to.be.a('function');

				sinon.assert.calledOnce(mockedPromise.catch);
				callArgs = mockedPromise.catch.getCall(0).args;
				expect(callArgs[0]).to.be.a('function');
			},
		);

	},
);

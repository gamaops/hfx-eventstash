import { expect } from 'chai';
import sinon from 'sinon';

declare const requireUncached: any;
declare const mockUncached: any;

describe(
	'logstash',
	() => {

		let spawn: any;
		let mockedLogstash: any;
		let logger: any;
		let logstash: any;

		beforeEach(
			() => {

				logger = {
					info: sinon.stub(),
					warn: sinon.stub(),
					error: sinon.stub(),
					child: sinon.stub().returns(logger),
				};

				mockedLogstash = {
					on: sinon.stub(),
					stdout: {
						on: sinon.stub(),
					},
					stderr: {
						on: sinon.stub(),
					},
				};

				spawn = sinon.stub().returns(mockedLogstash);

				mockUncached('child_process', {spawn});
				mockUncached('@src/logger.ts', {logger});

				logstash = requireUncached('@src/logstash.ts');

			},
		);

		it(
			'Should export object',
			() => {
				expect(logstash).to.be.an('object');
				expect(logstash.spawnLogstash).to.be.a('function');
			},
		);

		describe(
			'spawnLogstash',
			() => {

				it(
					'Should spawn a logstash process',
					() => {

						const result = logstash.spawnLogstash();

						expect(result).to.be.equal(mockedLogstash);

						let callArgs: any;

						sinon.assert.calledOnce(logger.child);
						callArgs = logger.child.getCall(0).args;
						expect(callArgs[0]).to.be.an('object');

						sinon.assert.calledOnce(spawn);
						callArgs = spawn.getCall(0).args;
						expect(callArgs[0]).to.be.a('string');
						expect(callArgs[1]).to.be.an('array');
						expect(callArgs[2]).to.be.an('object');

						sinon.assert.calledTwice(result.on);
						callArgs = result.on.getCall(0).args;
						expect(callArgs[0]).to.be.equal('error');
						expect(callArgs[1]).to.be.a('function');

						callArgs = result.on.getCall(1).args;
						expect(callArgs[0]).to.be.equal('exit');
						expect(callArgs[1]).to.be.a('function');

						sinon.assert.calledOnce(result.stdout.on);
						callArgs = result.stdout.on.getCall(0).args;
						expect(callArgs[0]).to.be.equal('data');
						expect(callArgs[1]).to.be.a('function');

						sinon.assert.calledOnce(result.stderr.on);
						callArgs = result.stderr.on.getCall(0).args;
						expect(callArgs[0]).to.be.equal('data');
						expect(callArgs[1]).to.be.a('function');

					},
				);

			},
		);

	},
);

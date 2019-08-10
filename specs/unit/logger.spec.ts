import { expect } from 'chai';
import sinon from 'sinon';

declare const requireUncached: any;
declare const mockUncached: any;

describe(
	'logger',
	() => {

		let Logger: any;
		let logger: any;
		let mockedLogger: any;

		beforeEach(
			() => {

				mockedLogger = Symbol();

				Logger = {
					createLogger: sinon.stub().returns(mockedLogger),
				};

				process.env.LOG_LEVEL = 'info';

				mockUncached('bunyan', Logger);

				logger = requireUncached('@src/logger.ts');

			},
		);

		it(
			'Should export object',
			() => {
				expect(logger).to.be.an('object');
			},
		);

		describe(
			'logger',
			() => {

				it(
					'Should export logger',
					() => {

						expect(logger.logger).to.be.equal(mockedLogger);

						let callArgs: any;

						sinon.assert.calledOnce(Logger.createLogger);
						callArgs = Logger.createLogger.getCall(0).args;
						expect(callArgs[0]).to.be.an('object');
						expect(callArgs[0].name).to.be.equal('eventstash');
						expect(callArgs[0].level).to.be.equal('info');

					},
				);

			},
		);

	},
);

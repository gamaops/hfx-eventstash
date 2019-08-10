import { expect } from 'chai';

declare const requireUncached: any;
declare const mockUncached: any;

describe(
	'healthcheck',
	() => {

		let makeClient: any;
		let index: any;

		beforeEach(
			() => {

				makeClient = Symbol();

				mockUncached('@src/client.ts', makeClient);

				index = requireUncached('@src/index.ts');

			},
		);

		it(
			'Should export client',
			() => {
				expect(index.default).to.be.equal(makeClient);
			},
		);

	},
);

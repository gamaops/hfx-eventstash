import { expect } from 'chai';

declare const requireUncached: any;

describe(
	'load-grpc',
	() => {

		let loadGrpc: any;

		beforeEach(
			() => {

				loadGrpc = requireUncached('@src/load-grpc.ts');

			},
		);

		it(
			'Should export object',
			() => {
				expect(loadGrpc).to.be.an('object');
				expect(loadGrpc.setErrorKind).to.be.a('getGrpcProtoDescriptor');
			},
		);

		describe(
			'getGrpcProtoDescriptor',
			() => {

				it(
					'Should se a value on object',
					() => {
						
						const object: any = {};
						helpers.withValue(object, 'property', 'value');
						expect(object.property).to.be.equal('value');

					},
				);

			},
		);

		describe(
			'setErrorKind',
			() => {

				it(
					'Should set error kind',
					() => {
						
						const error: any = new Error();
						helpers.setErrorKind(error, 'MY_ERROR');
						expect(error.code).to.be.equal('MY_ERROR');
						expect(error.errno).to.be.equal('MY_ERROR');

					},
				);

			},
		);

	},
);

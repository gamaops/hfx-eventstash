import makeClient from './client';

export default makeClient;

if (require.main === module) {
	require('./server.js');
}

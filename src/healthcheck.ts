require('dotenv-defaults').config();

import makeClient from './client';
import { logger } from './logger';

const client = makeClient({
	uri: process.env.EVENTSTASH_RPC_URI!,
});

client.health.checkAsync({}).then((response) => {
	if (response.status === 'SERVING') {
		process.exit(0);
	}
	process.exit(1);
}).catch((error) => {
	logger.error(error);
	process.exit(1);
});

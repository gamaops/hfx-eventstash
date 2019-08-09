import Logger from 'bunyan';

let LOG_LEVEL: Logger.LogLevelString = 'debug';

switch (process.env.LOG_LEVEL) {
	case 'info':
	LOG_LEVEL = 'info';
	break;
	case 'debug':
	LOG_LEVEL = 'debug';
	break;
	case 'error':
	LOG_LEVEL = 'error';
	break;
	case 'warn':
	LOG_LEVEL = 'warn';
	break;
}

export const logger = Logger.createLogger({
	name: 'eventstash',
	level: LOG_LEVEL,
});

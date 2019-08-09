import { ChildProcess, spawn } from 'child_process';
import { logger } from './logger';

const logstashLogger = logger.child({process: 'logstash'});

export const spawnLogstash = (): ChildProcess => {
	const logstash = spawn(
		'/usr/src/hfxeventstash/logstash/bin/logstash',
		[
			'--path.settings',
			'/usr/src/hfxeventstash/lib',
			'--config.reload.automatic',
			'-f',
			'/usr/src/hfxeventstash/lib/logstash.conf',
		],
		{
			env: {
				...process.env,
				LOG_FORMAT: 'json',
			},
			detached: false,
		},
	);

	logstash.on('error', (error) => {
		logstashLogger.fatal(error);
		process.exit(1);
	}).on('exit', (code) => {
		if (code && code > 0) {
			logstashLogger.fatal(`Logstash exited with code: ${code}`);
			process.exit(1);
		}
		logstashLogger.warn(`Logstash exited with code: ${code}`);
	});

	logstash.stdout.on('data', (data) => {
		logstashLogger.info(data.toString('utf8'));
	});

	logstash.stderr.on('data', (data) => {
		logstashLogger.error(data.toString('utf8'));
	});

	process.on('SIGHUP', () => logstash.kill('SIGKULL'));

	return logstash;
};

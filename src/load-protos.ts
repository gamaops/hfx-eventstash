import glob from 'glob';
import path from 'path';
import { loadSync, Root } from 'protobufjs';
import { logger } from './logger';

export const loadProtos = (): Root => {

	const PROTOS_PATH = path.isAbsolute(process.env.PROTOS_GLOB!)
	? process.env.PROTOS_GLOB as string
	: path.join(process.cwd(), process.env.PROTOS_GLOB!);

	logger.info(`Loading protos from: ${PROTOS_PATH}`);

	const protoFiles = glob.sync(
		PROTOS_PATH,
		{
			nodir: true,
			absolute: true,
		},
	);

	logger.debug(protoFiles, 'Protos to be loaded');

	return loadSync(protoFiles);

};

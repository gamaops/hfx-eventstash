import glob from 'glob';
import path from 'path';
import { loadSync, Root } from 'protobufjs';
import { logger } from './logger';

export const loadProtos = (): Root => {

	const protosPath = path.isAbsolute(process.env.PROTOS_GLOB!)
	? process.env.PROTOS_GLOB as string
	: path.join(process.cwd(), process.env.PROTOS_GLOB!);

	logger.info(`Loading protos from: ${protosPath}`);

	const protoFiles = glob.sync(
		protosPath,
		{
			nodir: true,
			absolute: true,
		},
	);

	logger.debug(protoFiles, 'Protos to be loaded');

	return loadSync(protoFiles);

};

import { logger } from '../../../logger';
import { loadProtos } from '../../../load-protos';
import changeCase from 'change-case';
import { ChildProcess } from 'child_process';
import uuidv4 from 'uuid/v4';

var protos = loadProtos();

process.on('SIGHUP', () => {
	logger.info('Received SIGHUP, reloading protos');
	protos = loadProtos();
	logger.info(`Protos reloaded`);
});

export interface IStoreEventConfig {
	logstash: ChildProcess;
};

export default ({
	logstash
}: IStoreEventConfig) => (call: any, callback: any) => {
	call.on('data', ({
		kind,
		format,
		data,
		id
	}: any) => {
		kind = kind || 'event';
		id = id || uuidv4();
		const index = changeCase.kebab(kind);
		const doc: any = {index, kind, format: format.toUpperCase()};
		switch (doc.format) {
			case 'PROTOBUF':
				try {
					const type = protos.lookupType(kind);
					doc.data = type.decode(data).toJSON();
				} catch (error) {
					doc.invalidProto = true;
				}
			break;
			case 'JSON':
				try {
					doc.plain = data.toString('utf8');
					doc.data = JSON.parse(doc.plain);
					delete doc.plain;
				} catch (error) {
					doc.invalidJson = true;
				}
			break;
			default:
				doc.format = doc.format || null;
				doc.plain = data.toString('utf8');
			break;
		}
		if (id)
			doc.id = id;
		logstash.stdin!.write(JSON.stringify(doc)+'\n');
		logger.debug(doc);
	}).on('end', () => {
		callback(null, {
			success: true
		});
	});
};
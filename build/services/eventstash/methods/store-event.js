"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../../logger");
const load_protos_1 = require("../../../load-protos");
const change_case_1 = __importDefault(require("change-case"));
var protos = load_protos_1.loadProtos();
process.on('SIGHUP', () => {
    logger_1.logger.info('Received SIGHUP, reloading protos');
    protos = load_protos_1.loadProtos();
    logger_1.logger.info(`Protos reloaded`);
});
;
exports.default = ({ logstash }) => (call, callback) => {
    call.on('data', ({ kind, format, data, id }) => {
        kind = kind || 'event';
        id = id || null;
        const index = change_case_1.default.kebab(kind);
        const doc = { index, kind, format: format.toUpperCase() };
        switch (doc.format) {
            case 'PROTOBUF':
                try {
                    const type = protos.lookupType(kind);
                    doc.data = type.decode(data).toJSON();
                }
                catch (error) {
                    doc.invalidProto = true;
                }
                break;
            case 'JSON':
                try {
                    doc.plain = data.toString('utf8');
                    doc.data = JSON.parse(doc.plain);
                    delete doc.plain;
                }
                catch (error) {
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
        logstash.stdin.write(JSON.stringify(doc) + '\n');
        logger_1.logger.debug(doc);
    }).on('end', () => {
        callback(null, {
            success: true
        });
    });
};

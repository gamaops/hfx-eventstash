"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const logger_1 = require("./logger");
const logstashLogger = logger_1.logger.child({ process: 'logstash' });
exports.spawnLogstash = () => {
    const logstash = child_process_1.spawn('/usr/src/hfxeventstash/logstash/bin/logstash', [
        '--path.settings',
        '/usr/src/hfxeventstash/lib',
        '--config.reload.automatic',
        '-f',
        '/usr/src/hfxeventstash/lib/logstash.conf',
    ], {
        env: {
            ...process.env,
            LOG_FORMAT: 'json',
        },
        detached: false,
    });
    logstash.on('error', (error) => {
        logstashLogger.fatal(error);
        process.exit(1);
    });
    logstash.on('exit', (code) => {
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
    process.on('SIGHUP', () => logstash.kill('SIGHUP'));
    return logstash;
};

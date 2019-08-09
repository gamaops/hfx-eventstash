"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const logger_1 = require("./logger");
const logstashLogger = logger_1.logger.child({ name: 'logstash' });
exports.spawnLogstash = () => {
    const logstash = child_process_1.spawn('/usr/src/app/logstash/bin/logstash', [
        '--path.settings',
        '/usr/src/app/lib',
        '--config.reload.automatic'
    ], {
        env: {
            ...process.env,
            LOG_FORMAT: 'json'
        },
        detached: false,
    });
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
        try {
            data = data.toString('utf8');
            data = JSON.parse(data);
        }
        catch (error) { }
        logstashLogger.info(data);
    });
    logstash.stderr.on('data', (data) => {
        try {
            data = data.toString('utf8');
            data = JSON.parse(data);
        }
        catch (error) { }
        logstashLogger.error(data);
    });
    process.on('SIGHUP', () => logstash.kill('SIGKULL'));
    return logstash;
};

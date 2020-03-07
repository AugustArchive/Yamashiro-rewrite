import { YamashiroClient, Configuration, Colors } from './Structures';
import { readFileSync, existsSync } from 'fs';
import { init, captureException } from '@sentry/node';
import { setDefaults } from 'wumpfetch';
import * as Constants from './Utils/Constants';
import { safeLoad } from 'js-yaml';
import { sep } from 'path';
import Logger from './Structures/Logging/Logger';
import server from './server';

import './Utils/Prototypes';
setDefaults({
    headers: {
        'User-Agent': Constants.USER_AGENT,
        'Content-Type': 'application/json'
    }
});

if (!existsSync(`${process.cwd()}${sep}config.yml`)) {
    console.warn(`${Colors.yellow('WARNING:')} The bot is currently missing the "config.yml" file. The bot configuration file needs to be located in ${process.cwd()}${sep}config.yml.`);
    process.exit(69);
}

const _ymlFile = readFileSync(`${process.cwd()}${sep}config.yml`);
const logger   = new Logger();
const config   = safeLoad<Configuration>(_ymlFile.toString());
const client   = new YamashiroClient(config);

if (config.sentryDSN) {
    logger.info('Detected Sentry DSN! Now loading Sentry...');
    init({
        dsn: config.sentryDSN,
        environment: config.environment === 'dev'? 'development': 'production',
        debug: config.environment === 'dev'
    });
} else {
    logger.info('No sentry DSN was found. This is optional but highly recommended!');
}

server(client, 6654);
client.start();

process
    .on('unhandledRejection', (reason, _) => {
        if (reason) {
            logger.error(`Received "unhandledRejection" protocol:\n${reason}`);
            captureException(reason);
            return;
        }

        logger.error('Received "unhandledRejection" protocol without any reason?');
    })
    .on('uncaughtException', (error) => {
        logger.error(`Received "uncaughtException" protocol:\n${error}`);
        captureException(error);
    });
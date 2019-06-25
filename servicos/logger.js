const winston = require('winston');

const logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: "info",
            filename: "logs/payfast.log",
            maxsize: 100000,
            maxFiles: 10
        })
    ]
});

logger.log('Log utilizando o winston');
logger.log('info', 'Log do nível info');
logger.info('Log usando info diretamente');

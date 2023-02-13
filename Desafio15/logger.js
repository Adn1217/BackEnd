import winston from 'winston';

function buildDefaultLogger(){
    const devLogger = winston.createLogger({
        level: 'debug',
        transports: [
            new winston.transports.Console({level: 'info'}),
            new winston.transports.File({filename: 'warn.log', level: 'warn'}),
            new winston.transports.File({filename: 'error.log', level: 'error'}),
        ]
    })
    return devLogger;
}

function buildProdLogger(){
    const prodLogger = winston.createLogger({
        level: 'info',
        transports: [
            // new winston.transports.Console({level: 'Info'}),
            new winston.transports.File({filename: 'warn.log', level: 'warn'}),
            new winston.transports.File({filename: 'error.log', level: 'error'}),
        ]
    })
    return prodLogger;
}

let logger = buildDefaultLogger();

if(process.env.NODE_ENV === 'prod'){
    logger = buildProdLogger();
}

export default logger;
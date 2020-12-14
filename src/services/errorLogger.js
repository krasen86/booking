const winston = require('winston');
const { createLogger,transports, format} = require('winston');
const { combine, timestamp, printf } = format;
require('winston-mongodb');
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

class ErrorLogger {
    constructor() {
        this.errorLogger = createLogger({
            format: combine(
                timestamp(),
                myFormat
            ),
            transports: [
                new transports.MongoDB({
                    db: 'mongodb://localhost:27017/booking',
                    collection:'logs',
                    capped:true,
                    options: { useUnifiedTopology: true }
                }),
                new winston.transports.Console(),
            ]
        });
    }

    logError(errorMessage, label){
        this.errorLogger.log({
            label: label,
            level: 'error',
            message: errorMessage
        });
    }


}
module.exports.ErrorLogger = ErrorLogger
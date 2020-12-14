const winston = require('winston');
const { createLogger, format} = require('winston');
const { combine, timestamp, printf } = format;
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
                new winston.transports.File({ filename: './logs/errors.log' }),
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
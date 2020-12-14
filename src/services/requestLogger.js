const winston = require('winston');
const { createLogger, format} = require('winston');
const { combine, timestamp, printf } = format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

class RequestLogger {
    constructor() {
        this.requestLogger = createLogger({
            format: combine(
                timestamp(),
                myFormat
            ),
            transports: [
                new winston.transports.File({ filename: './logs/requests.log' }),
                new winston.transports.Console(),
            ]
        });
    }

    logDeniedRequest(request){
        this.requestLogger.log({
            label: 'Denied',
            level: 'warn',
            message: 'Request id: ' + request.requestid + ' User id: ' + request.userid + ' Dentist id: ' + request.dentistid
        });
    }

    logAcceptedRequest(request){
        this.requestLogger.log({
            label: 'Accepted',
            level: 'info',
            message: 'Request id: ' + request.requestid + ' User id: ' + request.userid + ' Dentist id: ' + request.dentistid
        });
    }
}
module.exports.RequestLogger = RequestLogger
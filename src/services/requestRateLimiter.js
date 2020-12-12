const winston = require('winston');
const RateLimiter = require('limiter').RateLimiter;
const {BookingController} = require("../booking-handler/bookingController");
const { createLogger, format} = require('winston');
const { combine, timestamp, printf } = format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

class RequestRateLimiter {
    constructor(tokensPerInterval, Interval) {
        this.limiter = new RateLimiter(tokensPerInterval, Interval, true);
        this.counter = 0
        this.bookingController = new BookingController();
        this.logger = createLogger({
            format: combine(
                timestamp(),
                myFormat
            ),
            transports: [
                new winston.transports.File({ filename: './logs/requests.log' })
            ]
        });
    }

    fire(message) {
        let _this = this
        let request = JSON.parse(message)

        this.limiter.removeTokens(1, function(err, remainingRequests) {
            console.log(_this.counter++)

            if (remainingRequests < 0) {
                console.log('too many request to handle')
                _this.logger.log({
                    label: 'Denied',
                    level: 'warn',
                    message: 'Request id: ' + request.requestid + ' User id: ' + request.userid + ' Dentist id: ' + request.dentistid
                });
            } else {
                console.log('request accepted')
                _this.bookingController.processRequest(message)
                _this.logger.log({
                    label: 'Accepted',
                    level: 'info',
                    message: 'Request id: ' + request.requestid + ' User id: ' + request.userid + ' Dentist id: ' + request.dentistid
                });
            }
        })

    }
}
module.exports.RequestRateLimiter = RequestRateLimiter

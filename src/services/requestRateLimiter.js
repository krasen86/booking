const RateLimiter = require('limiter').RateLimiter;
const {BookingController} = require("../booking-handler/bookingController");
const {RequestLogger} = require('./requestLogger');

class RequestRateLimiter {
    constructor(tokensPerInterval, Interval) {
        this.limiter = new RateLimiter(tokensPerInterval, Interval, true);
        this.bookingController = new BookingController();
        this.requestLogger = new RequestLogger();
    }

    fire(message) {
        let _this = this
        let request = JSON.parse(message)

        this.limiter.removeTokens(1, function(err, remainingRequests) {
            if (remainingRequests < 0) {
               _this.requestLogger.logDeniedRequest(request)
            } else {
                _this.bookingController.processRequest(message)
                _this.requestLogger.logAcceptedRequest(request)
            }
        })

    }
}
module.exports.RequestRateLimiter = RequestRateLimiter

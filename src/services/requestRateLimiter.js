
const RateLimiter = require('limiter').RateLimiter;
const {BookingController} = require("../booking-handler/bookingController");


class RequestRateLimiter {
    constructor(tokensPerInterval, Interval) {
        this.limiter = new RateLimiter(tokensPerInterval, Interval, true);
        this.counter = 0
        this.bookingController = new BookingController();
    }

    fire(message) {
       var _this = this

        this.limiter.removeTokens(1, function(err, remainingRequests) {
            console.log(_this.counter++)

            if (remainingRequests < 0) {
                console.log('too many request to handle')
            } else {
                console.log('request accepted')
                _this.bookingController.processRequest(message)
            }
        })

    }
}
module.exports.RequestRateLimiter = RequestRateLimiter

const {RequestHandler} = require("./requestHandler");


class BookingController {
    constructor() {
    }
    processRequest(message) {
        const bookingRequest = message.toString('utf-8');
        let requestHandler = new RequestHandler();
        requestHandler.checkTimeSlot(JSON.parse(bookingRequest));
    }
    processBooking(message) {
        const buffer = message.toString('utf-8');
    }
}
module.exports.BookingController = BookingController
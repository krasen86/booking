const {RequestHandler} = require("./requestHandler");
const {BookingHandler} = require("./bookingHandler");


class BookingController {
    constructor() {
    }
    processRequest(message) {
        const bookingRequest = message.toString('utf-8');
        let requestHandler = new RequestHandler();
        requestHandler.checkTimeSlot(JSON.parse(bookingRequest));
    }
    processBooking(message) {
        const confirmation = message.toString('utf-8');
        let bookingHandler = new BookingHandler();
        bookingHandler.checkConfirmation(JSON.parse(confirmation))
    }
}
module.exports.BookingController = BookingController
const {Publisher} = require( "../services/publisher");
const {BookingIO} = require("./bookingIO");


class BookingHandler {
    constructor() {
    }
    checkConfirmation(confirmation) {
        let publisher = new Publisher();
        let bookingIO = new BookingIO();
        let bookingRequest = bookingIO.readRequest(confirmation);
        const index = bookingRequest.findIndex(item => item.time === confirmation.time);
        let booking = bookingRequest[index]

        if (confirmation.available) {
            publisher.publishBookingResponse(booking);
        } else {
            booking.error = 'Time not available'
            publisher.publishBookingResponse(booking.error);
        }
    }


}
module.exports.BookingHandler = BookingHandler
const {Publisher} = require( "../services/publisher");
const {BookingIO} = require("./bookingIO");


class RequestHandler {
    constructor() {
    }
    checkTimeSlot(bookingRequest) {
        let publisher = new Publisher();
        let timeSlot = {};
        timeSlot.dentistid =bookingRequest.dentistid;
        timeSlot.time = bookingRequest.time;
        publisher.publishTimeslotCheck(timeSlot);
        let bookingIO = new BookingIO();
        bookingIO.writeRequest(bookingRequest);
    }
}
module.exports.RequestHandler = RequestHandler
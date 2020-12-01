const {Publisher} = require( "../services/publisher");
const {BookingIO} = require("./bookingIO");
const variables = require("../config/variables")

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
        bookingIO.writeData(variables.DIRECTORY_REQUESTS, bookingRequest);
    }
}
module.exports.RequestHandler = RequestHandler
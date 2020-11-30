const {Publisher} = require( "../services/publisher");
const {BookingIO} = require("./bookingIO");


class BookingHandler {
    constructor() {
    }
    checkConfirmation(confirmation) {
        let publisher = new Publisher();
        let bookingIO = new BookingIO();
        let bookingRequests = bookingIO.readRequest(confirmation);

        bookingRequests.then(requests => {
            let list = JSON.parse(requests);
            const index = list.findIndex(item => item.time === confirmation.time);
            let booking = list[index]
            if (confirmation.available && booking !== undefined) {
                let success = {};
                success.userid = booking.userid;
                success.requestid = booking.requestid;
                success.time = booking.time;
                bookingIO.deleteRequest(confirmation);
                publisher.publishBookingResponse(success);
            } else if (!confirmation.available && booking !== undefined) {
                let error = {};
                error.userid = booking.userid;
                error.requestid = booking.requestid;
                publisher.publishBookingResponse(error);
            } else {
                console.log("Error no matching booking requests with availability confirmation")
            }
        }).catch(err => {
            console.log(err)
        })

    }


}
module.exports.BookingHandler = BookingHandler
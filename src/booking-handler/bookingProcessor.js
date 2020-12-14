const {Publisher} = require( "../services/publisher");
const {BookingDataController} = require("./bookingDataController");

class BookingProcessor {
    constructor() {
    }
    async checkConfirmation(confirmation) {
        let bookingDataController = new BookingDataController();
        let requestList = await bookingDataController.readData();
            let booking = {}
            if (requestList.filter(request => request.time === confirmation.time)>1) {
                let sameBookingTimeRequests = requestList.filter(bookingRequest => {
                    if (bookingRequest.time === confirmation.time) {
                        return bookingRequest
                    }
                });
                sameBookingTimeRequests.sort(  ( a, b ) => { return a.issuance - b.issuance; } );
                booking = sameBookingTimeRequests[0];
            } else {
                let index = requestList.findIndex(request => request.time === confirmation.time);
                booking = requestList[index]
            }

            if (confirmation.available && booking !== undefined) {
                this.processAcceptedRequest(booking, confirmation, requestList)
            } else if (!confirmation.available && booking !== undefined) {
                this.removeDeclinedRequests(requestList, confirmation.time, booking.dentistid);
            } else {
                console.log("Error no matching booking requests with availability confirmation")
            }
    }

    processAcceptedRequest(booking, confirmation, requestList) {
        let publisher = new Publisher();
        let bookingDataController = new BookingDataController();
        let success = {};
        success.userid = booking.userid;
        success.requestid = booking.requestid;
        success.time = booking.time;
        bookingDataController.deleteData(confirmation);
        bookingDataController.writeBooking(booking);
        publisher.publishBookingResponse(success);

        if (requestList.some(request => request.time === confirmation.time)) {
            const index = requestList.findIndex(request => request.userid === booking.userid);
            requestList.splice(index,1);
            this.removeDeclinedRequests(requestList, confirmation.time, booking.dentistid);
        }
    }

    removeDeclinedRequests(requestList, time) {
        let publisher = new Publisher();
        let bookingDataController = new BookingDataController();
        let updatedList = requestList.filter(bookingRequest => {
            if (bookingRequest.time === time) {
                let declinedRequest = {};
                declinedRequest.userid = bookingRequest.userid;
                declinedRequest.requestid = bookingRequest.requestid;
                publisher.publishBookingResponse(declinedRequest);
                bookingDataController.deleteData(bookingRequest);
            }
            else {
                return bookingRequest
            }
        });
    }
}
module.exports.BookingProcessor = BookingProcessor
const {Publisher} = require( "../services/publisher");
const {BookingDataController} = require("./bookingDataController");
const variables = require("../config/variables")

class BookingProcessor {
    constructor() {
    }
    checkConfirmation(confirmation) {
        let bookingDataController = new BookingDataController();
        let bookingRequests = bookingDataController.readData(variables.DIRECTORY_REQUESTS, confirmation);

        bookingRequests.then(requests => {
            let requestList = JSON.parse(requests);
            let booking = {}
            if (requestList.some(request => request.time === confirmation.time)) {
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
        }).catch(err => {
            console.log(err)
        })
    }

    processAcceptedRequest(booking, confirmation, requestList) {
        let publisher = new Publisher();
        let bookingDataController = new BookingDataController();
        let success = {};
        success.userid = booking.userid;
        success.requestid = booking.requestid;
        success.time = booking.time;
        bookingDataController.deleteData(variables.DIRECTORY_REQUESTS, confirmation);
        bookingDataController.writeData(variables.DIRECTORY_BOOKING, booking);
        publisher.publishBookingResponse(success);

        if (requestList.some(request => request.time === confirmation.time)) {
            const index = requestList.findIndex(request => request.userid === booking.userid);
            requestList.splice(index,1);
            this.removeDeclinedRequests(requestList, confirmation.time, booking.dentistid);
        }
    }

    removeDeclinedRequests(requestList, time, dentistid) {
        let publisher = new Publisher();
        let bookingDataController = new BookingDataController();
        let updatedList = requestList.filter(bookingRequest => {
            if (bookingRequest.time === time) {
                let declinedRequest = {};
                declinedRequest.userid = bookingRequest.userid;
                declinedRequest.requestid = bookingRequest.requestid;
                publisher.publishBookingResponse(declinedRequest);
            }
            else {
                return bookingRequest
            }
        });
        bookingDataController.replaceDataSet(variables.DIRECTORY_REQUESTS, dentistid, updatedList)
    }
}
module.exports.BookingProcessor = BookingProcessor
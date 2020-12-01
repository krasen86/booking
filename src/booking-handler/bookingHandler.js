const {Publisher} = require( "../services/publisher");
const {BookingIO} = require("./bookingIO");
const variables = require("../config/variables")

class BookingHandler {
    constructor() {
    }
    checkConfirmation(confirmation) {
        let publisher = new Publisher();
        let bookingIO = new BookingIO();
        let bookingRequests = bookingIO.readData(variables.DIRECTORY_REQUESTS, confirmation);
        bookingRequests.then(requests => {
            let list = JSON.parse(requests);
            const index = list.findIndex(item => item.time === confirmation.time);
            let booking = list[index]
            if (confirmation.available && booking !== undefined) {
                let success = {};
                success.userid = booking.userid;
                success.requestid = booking.requestid;
                success.time = booking.time;
                bookingIO.deleteData(variables.DIRECTORY_REQUESTS, confirmation);
                bookingIO.writeData(variables.DIRECTORY_BOOKING, booking);
                publisher.publishBookingResponse(success);
                if (list.some(item => item.time === confirmation.time)) {
                    const index = list.findIndex(item => item.userid === booking.userid);
                    list.splice(index,1);
                    this.removeBookingRequests(list, confirmation.time, booking.dentistid);
                }
            } else if (!confirmation.available && booking !== undefined) {
                this.removeBookingRequests(list, confirmation.time, booking.dentistid);
            } else {
                console.log("Error no matching booking requests with availability confirmation")
            }
        }).catch(err => {
            console.log(err)
        })
    }
    removeBookingRequests(list, time, dentistid) {
        let publisher = new Publisher();
        let bookingIO = new BookingIO();
        let updatedList = list.filter(item => {
            if (item.time === time) {
                let error = {};
                error.userid = item.userid;
                error.requestid = item.requestid;
                publisher.publishBookingResponse(error);
            }
            else {
                return item
            }
        });
        bookingIO.replaceDataSet(variables.DIRECTORY_REQUESTS, dentistid, updatedList)
    }
}
module.exports.BookingHandler = BookingHandler
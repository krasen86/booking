const fs = require("fs");

class BookingIO {
    constructor() {
    }

    saveBooking() {

    }

    writeRequest(request) {
        let fileName = './booking-data/requests-' + request.dentistid +'.json'
        try {
            if (fs.existsSync(fileName)) {
                fs.readFile(fileName, (err, data) => {
                    const requests = data.toString('utf-8');
                    let bookingRequests = JSON.parse(requests);
                    bookingRequests.push(request);
                    fs.writeFileSync(fileName, JSON.stringify(bookingRequests));
                })
            } else {
                let dir = './booking-data'
                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                }
                let timeSlots = [];
                timeSlots.push(request)
                fs.writeFileSync(fileName, JSON.stringify(timeSlots));
            }
        } catch(err) {
            console.error(err)
        }
    }

}
module.exports.BookingIO = BookingIO
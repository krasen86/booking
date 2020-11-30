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
                let bookingRequests = this.readRequest(request);
                bookingRequests.then(response => {
                    let list = JSON.parse(response)
                    list.push(request)
                    fs.writeFileSync(fileName, JSON.stringify(list));
                }).catch(err => {
                    console.log(err)
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
    deleteRequest(request) {
        let fileName = './booking-data/requests-' + request.dentistid +'.json'
        let bookingRequests = this.readRequest(request);
        bookingRequests.then(response => {
            let list = JSON.parse(response);
            const index = list.findIndex(item => item.userid === request.userid);
            list.splice(index,1);
            fs.writeFileSync(fileName, JSON.stringify(list));
        })
    }

    readRequest(request) {
        let fileName = './booking-data/requests-' + request.dentistid +'.json'
        return new Promise((resolve, reject) => {
            fs.readFile(fileName, (err, data) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve( data);
                }
            })
        })

    }

}
module.exports.BookingIO = BookingIO
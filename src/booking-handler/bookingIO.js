const fs = require("fs");
const variables = require("../config/variables")

class BookingIO {
    constructor() {
    }

    writeData(dir, request) {
        let fileName =dir + request.dentistid +'.json'
        try {
            if (fs.existsSync(fileName)) {
                let bookingRequests = this.readData(dir, request);
                bookingRequests.then(response => {
                    let list = JSON.parse(response)
                    list.push(request)
                    fs.writeFileSync(fileName, JSON.stringify(list));
                }).catch(err => {
                    console.log(err)
                })
            } else {
                if (!fs.existsSync(variables.DIRECTORY)){
                    fs.mkdirSync(variables.DIRECTORY);
                }
                let list = [];
                list.push(request)
                fs.writeFileSync(fileName, JSON.stringify(list));
            }
        } catch(err) {
            console.error(err)
        }
    }
    deleteData(dir, request) {
        let fileName = dir + request.dentistid +'.json'
        let bookingRequests = this.readData(dir, request);
        bookingRequests.then(response => {
            let list = JSON.parse(response);
            const index = list.findIndex(item => item.userid === request.userid);
            list.splice(index,1);
            fs.writeFileSync(fileName, JSON.stringify(list));
        })
    }

    readData(dir, request) {
        let fileName = dir + request.dentistid +'.json'
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
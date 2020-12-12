const fs = require("fs");
const variables = require("../config/variables")
const {ErrorLogger} = require('../services/errorLogger');

class BookingDataController {
    constructor() {
        this.errorLogger = new ErrorLogger();
    }
    writeData(dir, data) {
        let fileName = dir + data.dentistid +'.json'
        try {
            if (fs.existsSync(fileName)) {
                let bookingData = this.readData(dir, data);
                bookingData.then(response => {
                    let list = JSON.parse(response)
                    list.push(data)
                    fs.writeFileSync(fileName, JSON.stringify(list));
                }).catch(err => {
                    console.log(err)
                })
            } else {
                if (!fs.existsSync(variables.DIRECTORY)){
                    fs.mkdirSync(variables.DIRECTORY);
                }
                let list = [];
                list.push(data)
                fs.writeFileSync(fileName, JSON.stringify(list));
            }
        } catch(err) {

            this.errorLogger.logError(err, 'File System')
        }
    }
    deleteData(dir, data) {
        let fileName = dir + data.dentistid +'.json'
        let bookingData = this.readData(dir, data);
        bookingData.then(response => {
            let list = JSON.parse(response);
            const index = list.findIndex(item => item.userid === data.userid);
            list.splice(index,1);
            fs.writeFileSync(fileName, JSON.stringify(list));
        })
    }

    readData(dir, data) {
        let fileName = dir + data.dentistid +'.json'
        return new Promise((resolve, reject) => {
            fs.readFile(fileName, (err, readData) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve( readData);
                }
            })
        })

    }

    replaceDataSet(dir, id, dataSet) {
        let fileName = dir + id +'.json'
        fs.readFile(fileName, () => {
            fs.writeFileSync(fileName, JSON.stringify(dataSet));
        })

    }
}
module.exports.BookingDataController = BookingDataController
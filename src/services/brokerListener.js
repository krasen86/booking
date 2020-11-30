const {MQTT} = require('./mqttConnector');
const variables = require("../config/variables");
const {BookingController} = require("../booking-handler/bookingController");

class BrokerListener {
    constructor() {
    }
    listenForMessage() {
        MQTT.on('message', function (topic, message) {
            const bookingController = new BookingController();
            console.log(topic + message)
            if (topic === variables.REQUEST_TOPIC) {
                bookingController.processRequest(message);
                console.log('-->' + message);
            }else if (topic === variables.CONFIRMATION_TOPIC) {
                bookingController.processBooking(message);
                console.log('-->' + message);
            }
        })
    }
}
module.exports.BrokerListener = BrokerListener

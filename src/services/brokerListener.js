const {MQTT} = require('./mqttConnector');
const variables = require("../config/variables");
const {BookingController} = require("../booking-handler/bookingController");

class BrokerListener {
    constructor() {
    }
    listenForMessage() {
        MQTT.on('message', function (topic, message) {
            const bookingController = new BookingController();
            if (topic === variables.REQUEST_TOPIC) {
                bookingController.processRequest(message);
            }
            else if (topic === variables.CONFIRMATION_TOPIC) {
                bookingController.processBooking(message);
            }
        })
    }
}
module.exports.BrokerListener = BrokerListener

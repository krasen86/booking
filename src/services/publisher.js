const {MQTT} = require("./mqttConnector")
const variables = require("../config/variables")

class Publisher {
    constructor() {
    }
    publishBookingResponse(bookingResponse) {

        MQTT.publish(variables.RESPONSE_TOPIC + "/" + bookingResponse.userId, bookingResponse, {retain:true});
    }

    publishTimeslotCheck(timeSlot) {
        MQTT.publish(variables.TIMESLOT_TOPIC, JSON.stringify(timeSlot), {retain:true});
    }
}
module.exports.Publisher = Publisher;



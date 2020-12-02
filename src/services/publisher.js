const {MQTT} = require("./mqttConnector")
const variables = require("../config/variables")

class Publisher {
    constructor() {
    }
    publishBookingResponse(bookingResponse) {
        MQTT.publish(variables.RESPONSE_TOPIC + "/" + bookingResponse.userid, JSON.stringify(bookingResponse), {qos:1, retain:true});
    }

    publishTimeslotCheck(timeSlot) {
        MQTT.publish(variables.TIMESLOT_TOPIC, JSON.stringify(timeSlot), {qos:1, retain:true})
    }
}
module.exports.Publisher = Publisher;



const { Schema, model, models } = require('mongoose')

const ticketCountSchema = new Schema ({
    _id: {
        // Guild ID
        type: String,
        required: true
    },
    ticketCount: {
        type: Number,
        required: true
    }
});

const name = "ticket-counter";
module.exports = models[name] || model(name, ticketCountSchema);
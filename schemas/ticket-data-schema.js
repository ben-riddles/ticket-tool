const { Schema, model, models } = require('mongoose')

const ticketDataSchema = new Schema({
    serverId: {
        // Guild ID
        type: String,
        required: true
    },
    ticketNumber: {
        type: String,
        required: true
    },
    ticketOwner: {
        type: String,
        required: true
    },
    ticketChannelId: {
        type: String,
        required: true
    },
    claimedBy: {
        type: String,
        required: true
    },
});

const name = "ticket-data";
module.exports = models[name] || model(name, ticketDataSchema);
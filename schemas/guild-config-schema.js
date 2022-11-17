const { Schema, model, models } = require('mongoose')

const guildConfigSchema = new Schema({
    _id: {
        // Guild ID
        type: String,
        required: true
    },
    ticketSupportRole: {
        type: String,
        required: false
    },
    ticketCategory: {
        type: String,
        required: false
    },
    ticketLogs: {
        type: String,
        required: false
    },
    ticketCount: {
        type: Number,
        required: true
    },
    setup: {
        type: Boolean,
        required: false
    }
});

const name = "guild-config";
module.exports = models[name] || model(name, guildConfigSchema);
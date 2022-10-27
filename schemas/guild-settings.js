const { Schema, model, models } = require('mongoose')

const guildSettingsSchema = new Schema ({
    _id: {
        // Guild ID
        type: String,
        required: true
    },
    ticketSupportRole: {
        type: Array,
        required: true
    },
    ticketCategory: {
        type: Number,
        required: true
    }
});

const name = "guild-settings";
module.exports = models[name] || model(name, guildSettingsSchema);
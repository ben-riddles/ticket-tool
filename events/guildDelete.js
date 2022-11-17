const { EmbedBuilder } = require('discord.js');
const client = require('..');
const guildConfigSchema = require('../schemas/guild-config-schema');

client.on("guildDelete", async(guild) => {
    await guildConfigSchema.deleteOne({
        _id: guild.id,
    });
});
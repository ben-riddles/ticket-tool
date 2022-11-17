const { EmbedBuilder } = require('discord.js');
const client = require('..');
const guildConfigSchema = require('../schemas/guild-config-schema');

client.on("guildCreate", async(guild) => {
    const embed = new EmbedBuilder()
        .setTitle('Thank you for inviting Ticket Manager')
        .setDescription('Thank you for inviting **Ticket Manager** to this server, I hope that you find me useful!')
        .addFields({
            name: 'Commands',
            value: '`/help`\n`/ticket`',
            inline: true,
        }, {
            name: 'Documents',
            value: 'Support Discord: ##\nWebsite: ##',
            inline: true,
        }, {
            name: 'Let\'s get started!',
            value: 'Ticket Manager is set up as much as possible if you invite with the advised permissions. Configuration of the ticket bot can be done through our range of /slash commands!\n\nMembers of the server with the default `ticket-helper` role will be added to created tickets, you can add your own roles to this list by using `/ticketrole`',
            inline: false
        }, {
            name: 'Premium',
            value: 'Premium features, including a panel, will be coming soon!',
            inline: false,
        }, )
        .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

    await guildConfigSchema.findByIdAndUpdate({
        _id: guild.id,
    }, {
        _id: guild.id,
        ticketSupportRole: 'undefined',
        ticketCategory: 'undefined',
        ticketLogs: 'undefined',
        ticketCount: 1,
        setup: false
    }, {
        upsert: true
    });

    if (guild.systemChannel) {
        guild.systemChannel.send({
            embeds: [
                embed
            ]
        })
    } else return;
});
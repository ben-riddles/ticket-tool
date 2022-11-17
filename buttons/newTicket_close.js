const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const ticketDataSchema = require('../schemas/ticket-data-schema');
const guildConfigSchema = require('../schemas/guild-config-schema');

module.exports = {
    id: 'newTicket_close',
    permissions: [],
    run: async(client, interaction) => {
        await interaction.deferReply()
        guildConfig = await guildConfigSchema.findOne({
            _id: interaction.guild.id
        })

        ticketData = await ticketDataSchema.findOne({
            serverId: interaction.guild.id,
            ticketChannelId: interaction.channel.id
        })

        const ticketClaimedBy = ticketData.claimedBy === 'Not claimed' ? ticketData.claimedBy : `<@!${ticketData.claimedBy}>`
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('📜 Online Transcript')
                .setStyle('Link')
                .setURL('https://www.google.com')
            )

        const closedTicketEmbed = new EmbedBuilder()
            .setTitle('Ticket Closed')
            .addFields({
                name: 'Ticket ID',
                value: `#${ticketData.ticketNumber}`,
                inline: true,
            }, {
                name: 'Opened by',
                value: `<@!${ticketData.ticketOwner}>`,
                inline: true,
            }, {
                name: 'Closed by',
                value: `${interaction.user}`,
                inline: true,
            }, {
                name: 'Opened time',
                value: `<t:${Math.floor(interaction.channel.createdTimestamp / 1000)}:f>`,
                inline: true,
            }, {
                name: 'Claimed by',
                value: ticketClaimedBy,
                inline: true,
            })
            .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        let ticketLogs = interaction.guild.channels.cache.get(guildConfig.ticketLogs)
        ticketLogs.send({ embeds: [closedTicketEmbed], components: [row] })

        await interaction.editReply({ content: 'Closing ticket...' })
        await ticketDataSchema.findOneAndDelete({
            serverId: interaction.guild.id,
            ticketChannelId: interaction.channel.id
        })

        interaction.channel.delete()
    }
};
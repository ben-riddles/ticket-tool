const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType } = require('discord.js');
const ticketDataSchema = require('../../schemas/ticket-data-schema');
const guildConfigSchema = require('../../schemas/guild-config-schema');

module.exports = {
    name: 'closerequest',
    description: "Request the ticket owner for the ticket to be closed, with a reason (optional)",
    type: ApplicationCommandType.ChatInput,
    run: async(client, interaction) => {
        guildConfig = await guildConfigSchema.findOne({
            _id: interaction.guild.id
        })

        ticketData = await ticketDataSchema.findOne({
            serverId: interaction.guild.id,
            ticketChannelId: interaction.channel.id
        })

        if (!ticketData) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Invalid Ticket')
                .setDescription(`This channel is not a valid ticket`)
                .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
            return
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('🔒 Close')
                .setStyle('Danger')
                .setCustomId('newTicket_close')
            )

        const closeRequestEmbed = new EmbedBuilder()
            .setTitle('Close Request')
            .setDescription(`${interaction.user} has requested for this ticket to be closed.\n\nPlease accept below!`)
            .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        interaction.reply({ content: `<@${ticketData.ticketOwner}>`, embeds: [closeRequestEmbed], components: [row] })
    }
};
// create a new ticket 
const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const ticketCountSchema = require('../../schemas/ticket-count');

module.exports = {
	name: 'ticket',
	description: "Create a new ticket",
	type: ApplicationCommandType.ChatInput,
	run: async (client, interaction) => {
        ticketCounterResult = await ticketCountSchema.findByIdAndUpdate({
            _id: `${interaction.guild.id}`
        }, {
            _id: `${interaction.guild.id}`,
            $inc: {
                ticketCount: 1
            }
        }, {
            upsert: true
        })

        await interaction.guild.channels.create({
            name: `ticket-${ticketCounterResult.ticketCount}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
               {
                // Ticket Creator
                 id: interaction.member.id,
                 allow: [PermissionFlagsBits.ViewChannel],
               }, // Add Ticket Support Role
            ],
          })

        interaction.reply({content: 'OK!'})
	}
};

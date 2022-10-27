const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
	name: 'setup',
	description: "Setup the server for Ticket Manager Bot",
	type: ApplicationCommandType.ChatInput,
    default_member_permissions: 'Administrator',
    
	run: async (client, interaction) => {
        
	}
};

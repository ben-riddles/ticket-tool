const { EmbedBuilder } = require('discord.js');
const client = require('..');

client.on("guildCreate", async (guild) => {
    if (guild.systemChannel) {
        const embed = new EmbedBuilder()
        .setTitle('Thank you for inviting Ticket Manager')
        .setDescription('Thank you for inviting **Ticket Manager** to this server, I hope that you find me useful!')
        .addFields(
            {
                name: 'Commands',
                value: '`/help`\n`/ticket`',
                inline: true,
            },
            {
                name: 'Documents',
                value: 'Support Discord: ##\nWebsite: ##',
                inline: true,
            },
            {
                name: 'Let\'s get started!', 
                value: 'Ticket Manager is set up as much as possible if you invite with the advised permissions. Configuration of the ticket bot can be done through our range of /slash commands!\n\nMembers of the server with the default `ticket-helper` role will be added to created tickets, you can add your own roles to this list by using `/ticketrole`', 
                inline: false
            },
            {
                name: 'Premium',
                value: 'Premium features, including a panel, will be coming soon!',
                inline: false,
            },
        )
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();
        guild.systemChannel.send({embeds: [embed]})
    } 
});
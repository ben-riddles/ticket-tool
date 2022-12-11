const { EmbedBuilder, PermissionFlagsBits, ApplicationCommandType } = require('discord.js');

const ticketDataSchema = require('../../schemas/ticket-data-schema');
const guildConfigSchema = require('../../schemas/guild-config-schema');


module.exports = {
    name: 'add',
    description: "Add a user to the ticket",
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: 'user',
        description: 'Select a user',
        type: 6,
        required: true,
    }],
    run: async(client, interaction) => {
        supportRoleDb = await guildConfigSchema.findOne({ _id: interaction.guild.id })
        ticketDataDb = await ticketDataSchema.findOne({ serverId: interaction.guild.id, ticketChannelId: interaction.channel.id })
        const user = interaction.options.get('user').value
        console.log(user);

        if (!ticketDataDb) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Invalid Ticket')
                .setDescription(`This channel is not a valid ticket`)
                .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
            return
        }

        await interaction.channel.permissionOverwrites.edit({
            // New User
            id: user,
            allow: [PermissionFlagsBits.ViewChannel],
        })

        const userAddedEmbed = new EmbedBuilder()
            .setTitle('User Added')
            .setDescription(`${user} has been added to this ticket`)
            .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [userAddedEmbed] })

    }

};
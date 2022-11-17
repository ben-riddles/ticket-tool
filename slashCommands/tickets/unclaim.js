const { EmbedBuilder, PermissionFlagsBits, ApplicationCommandType } = require('discord.js');

const ticketDataSchema = require('../../schemas/ticket-data-schema');
const guildConfigSchema = require('../../schemas/guild-config-schema');


module.exports = {
    name: 'unclaim',
    description: "Unclaim a ticket",
    type: ApplicationCommandType.ChatInput,
    run: async(client, interaction) => {
        supportRoleDb = await guildConfigSchema.findOne({ _id: interaction.guild.id })
        ticketDataDb = await ticketDataSchema.findOne({ serverId: interaction.guild.id, ticketChannelId: interaction.channel.id })

        if (!ticketDataDb) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Invalid Ticket')
                .setDescription(`This channel is not a valid ticket`)
                .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
            return
        }

        if (interaction.member.roles.cache.has(supportRoleDb.ticketSupportRole)) {
            if (ticketDataDb.claimedBy !== 'Not claimed') {
                await interaction.channel.permissionOverwrites.set([{
                        // Ticket Support Role
                        id: supportRoleDb.ticketSupportRole,
                        allow: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        // Ticket Creator
                        id: ticketDataDb.ticketOwner,
                        allow: [PermissionFlagsBits.ViewChannel],
                    }
                ])

                insertClaimedBy = await ticketDataSchema.findOneAndUpdate({
                    serverId: interaction.guild.id,
                    ticketChannelId: interaction.channel.id
                }, {
                    claimedBy: `Not claimed`
                })


                const claimedTicketEmbed = new EmbedBuilder()
                    .setTitle('Ticket Unclaimed')
                    .setDescription(`${interaction.user} has unclaimed this ticket`)
                    .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();

                await interaction.reply({ embeds: [claimedTicketEmbed] })
            } else {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Ticket Info')
                    .setDescription(`This ticket has not been claimed`)
                    .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();

                await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
            }

        } else {
            const errorEmbed = new EmbedBuilder()
                .setTitle('No Permissions')
                .setDescription(`You do not have the <@&${supportRoleDb.ticketSupportRole}> role`)
                .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true })

        }
    }
};
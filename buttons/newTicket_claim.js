const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const ticketDataSchema = require('../schemas/ticket-data-schema');
const guildConfigSchema = require('../schemas/guild-config-schema');

module.exports = {
    id: 'newTicket_claim',
    permissions: [],
    run: async(client, interaction) => {
        supportRoleDb = await guildConfigSchema.findOne({ _id: interaction.guild.id })
        ticketDataDb = await ticketDataSchema.findOne({ serverId: interaction.guild.id, ticketChannelId: interaction.channel.id })

        if (interaction.member.roles.cache.has(supportRoleDb.ticketSupportRole)) {
            if (ticketDataDb.claimedBy === 'Not claimed') {
                await interaction.channel.permissionOverwrites.set([{
                        // Ticket Claimed By
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.SendMessages],
                    },
                    {
                        // Ticket Support Role
                        id: supportRoleDb.ticketSupportRole,
                        allow: [PermissionFlagsBits.ViewChannel],
                        deny: [PermissionFlagsBits.SendMessages],
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

                ticketData = await ticketDataSchema.findOne({
                    serverId: interaction.guild.id,
                    ticketChannelId: interaction.channel.id
                })

                insertClaimedBy = await ticketDataSchema.findOneAndUpdate({
                    serverId: interaction.guild.id,
                    ticketChannelId: interaction.channel.id
                }, {
                    claimedBy: `${interaction.user.id}`
                })


                const claimedTicketEmbed = new EmbedBuilder()
                    .setTitle('Ticket Claimed')
                    .setDescription(`${interaction.user} has claimed this ticket`)
                    .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();

                await interaction.reply({ embeds: [claimedTicketEmbed] })
            } else {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Ticket Claimed')
                    .setDescription(`This ticket has already been claimed by <@!${ticketDataDb.claimedBy}>`)
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
// create a new ticket 
const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const ticketDataSchema = require('../../schemas/ticket-data-schema');
const guildConfigSchema = require('../../schemas/guild-config-schema');

module.exports = {
    name: 'ticket',
    description: "Create a new ticket",
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: 'reason',
        description: 'A reason for the ticket to be created.',
        type: 3,
        required: false
    }],
    run: async(client, interaction) => {
        checkSetup = await guildConfigSchema.findOne({
            _id: interaction.guild.id
        })

        if (checkSetup.setup === false) {
            const embed = new EmbedBuilder()
                .setTitle('Error: Setup')
                .setDescription('To start using Ticket Manager, please run the `/setup` command first. Ensure that Ticket Manager has been invited with the recommended permissions!')
                .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
                .setTimestamp();

            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })

        } else {

            ticketCounterResult = await guildConfigSchema.findByIdAndUpdate({
                _id: `${interaction.guild.id}`
            }, {
                _id: `${interaction.guild.id}`,
                $inc: {
                    ticketCount: 1
                }
            }, {
                upsert: true
            })

            const reasonForTicket = interaction.options.get('reason');
            supportRoleDb = await guildConfigSchema.findOne({ _id: interaction.guild.id })
            ticketCategoryDb = await guildConfigSchema.findOne({ _id: interaction.guild.id })

            newTicket = await interaction.guild.channels.create({
                name: `ticket-${ticketCounterResult.ticketCount}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [{
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        // Ticket Creator
                        id: interaction.member.id,
                        allow: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        // Ticket Support Role
                        id: supportRoleDb.ticketSupportRole,
                        allow: [PermissionFlagsBits.ViewChannel],
                    },
                ],

            }).then(async(channel) => {

                await channel.setParent(`${ticketCategoryDb.ticketCategory}`, { lockPermissions: false })
                await ticketDataSchema.findOneAndUpdate({
                    serverId: `${interaction.guild.id}`,
                    ticketChannelId: `${channel.id}`,
                }, {
                    serverId: `${interaction.guild.id}`,
                    ticketNumber: `${ticketCounterResult.ticketCount}`,
                    ticketOwner: `${interaction.user.id}`,
                    ticketChannelId: `${channel.id}`,
                    claimedBy: 'Not claimed',
                }, {
                    upsert: true
                })

                // Send message in new ticket channel
                const newTicketEmbed = new EmbedBuilder()
                    .setTitle('New Ticket')
                    .setDescription(`${interaction.user.tag} your ticket has been created! We will help you as soon as possible.`)
                    .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })

                const ticketReasonEmbed = new EmbedBuilder()
                    .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();

                if (!reasonForTicket) {
                    ticketReasonEmbed.setDescription(`**Reason**\nNo specific reason`)

                } else {
                    ticketReasonEmbed.setDescription(`**Reason**\n${reasonForTicket.value}`)
                }

                const buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel('🔒 Close')
                        .setStyle('Secondary')
                        .setCustomId('newTicket_close')
                    )
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel('👋 Claim')
                        .setStyle('Secondary')
                        .setCustomId('newTicket_claim')
                    );

                channel.send({
                    content: `${interaction.user} <@&${supportRoleDb.ticketSupportRole}>`,
                    embeds: [
                        newTicketEmbed,
                        ticketReasonEmbed
                    ],
                    components: [
                        buttons
                    ]
                })

                // Reply to /ticket command
                const tyEmbed = new EmbedBuilder()
                    .setDescription(`✅ Thank you for opening a new ticket: ${channel}`)
                    .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();

                interaction.reply({
                    embeds: [
                        tyEmbed
                    ],
                    ephemeral: true
                })

            }).catch((err) => {
                console.log(err);
            })
        }
    }
};
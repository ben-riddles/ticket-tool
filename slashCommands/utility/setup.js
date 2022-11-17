const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const guildConfigSchema = require('../../schemas/guild-config-schema');

module.exports = {
    name: 'setup',
    description: "Setup the server for Ticket Manager Bot",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: 'Administrator',
    run: async(client, interaction) => {


        checkSetup = await guildConfigSchema.findOne({
            _id: interaction.guild.id
        })

        if (checkSetup.setup === false) {
            interaction.deferReply()

            const embed = new EmbedBuilder()
                .setTitle('Setup')
                .setDescription('✅ Created a new role: `ticket-helper`')
                .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
                .setTimestamp();

            interaction.guild.roles.create({
                name: 'ticket-helper',
            }).then(async(role) => {
                await guildConfigSchema.findByIdAndUpdate({
                        _id: interaction.guild.id
                    }, {
                        _id: interaction.guild.id,
                        ticketSupportRole: role.id,
                    },

                    {
                        upsert: true
                    })

                interaction.guild.channels.create({
                    name: 'Tickets',
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: [{
                            id: interaction.guild.roles.everyone,
                            deny: [PermissionFlagsBits.ViewChannel]
                        },
                        {
                            // Ticket Support Role
                            id: role.id,
                            allow: [PermissionFlagsBits.ViewChannel],
                        },
                    ],
                }).then(async(channel) => {
                    await guildConfigSchema.findByIdAndUpdate({
                            _id: interaction.guild.id
                        }, {
                            _id: interaction.guild.id,
                            ticketCategory: channel.id,
                            setup: true
                        },

                        {
                            upsert: true
                        })

                })

                interaction.guild.channels.create({
                    name: 'ticket-logs',
                    type: ChannelType.GuildText,
                    permissionOverwrites: [{
                            id: interaction.guild.roles.everyone,
                            deny: [PermissionFlagsBits.ViewChannel]
                        },
                        {
                            // Ticket Support Role
                            id: role.id,
                            allow: [PermissionFlagsBits.ViewChannel],
                        },
                    ],
                }).then(async(channel) => {
                    await guildConfigSchema.findByIdAndUpdate({
                            _id: interaction.guild.id
                        }, {
                            _id: interaction.guild.id,
                            ticketLogs: channel.id,
                            setup: true
                        },

                        {
                            upsert: true
                        })

                    channel.send({
                        content: '```This is a new channel, created by Ticket Manager, to store ticket logs and transcripts. You can move this channel around in your discord server, but please do not remove this channel```'
                    })

                })
            })

            await interaction.fetchReply({
                embeds: [
                    embed
                ]
            })

            await interaction.editReply({
                embeds: [
                    embed.setDescription('✅ Created a new role: `@ticket-helper`\n✅ Created new category: `Tickets`')
                ]
            })

            await interaction.editReply({
                embeds: [
                    embed.setDescription('✅ Created new role: `@ticket-helper`\n✅ Created new category: `Tickets`\n✅ Created new channel: `#ticket-logs`\n\n**Setup Complete**\nYour server has been successfully set up. For now, you can implement a default ticket panel by typing `/panel`')
                ]
            })

        } else {
            const embed = new EmbedBuilder()
                .setTitle('Your server is already set up!')
                .setDescription('I have already set up your server, if you think this is wrong, please type `/debug`')
                .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({
                embeds: [
                    embed
                ],
                ephemeral: true
            })
        }

    }
};
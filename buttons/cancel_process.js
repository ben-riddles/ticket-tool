module.exports = {
	id: 'cancel_process',
	permissions: [],
	run: async (client, interaction) => {
        await interaction.editReply({
            content: 'You have cancelled the process',
            components: []
            
        })
	}
};

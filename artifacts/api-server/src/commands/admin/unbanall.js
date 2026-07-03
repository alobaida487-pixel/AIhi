module.exports = {
    name: 'unbanall',
    async execute(message, args, client) {
        if (!message.member.permissions.has('BanMembers')) {
            return message.reply("❌ | You don't Have __permissions__");
        }

        try {
            const bans = await message.guild.bans.fetch();
            if (bans.size === 0) {
                return message.reply("There are no banned members.");
            }

            bans.forEach(ban => message.guild.members.unban(ban.user));
            message.reply(`** ${bans.size} members __has been__ unbanned.🛬**`);
        } catch (error) {
            console.error("Error unbanning all members:", error);
            message.reply("An error occurred while unbanning members.");
        }
    }
};

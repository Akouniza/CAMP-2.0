const { MessageEmbed } = require('discord.js');

module.exports = function getDefaultEmbed(bot, client, message, config, command, args) {
  return new MessageEmbed()
    .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
    .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());
};

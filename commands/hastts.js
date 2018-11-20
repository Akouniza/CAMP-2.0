const Discord = require('discord.js');

/**
 * @param {Discord.GuildMember} bot
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {string} command
 * @param {string[]} args
 */
module.exports.run = async (bot, client, config, message, command, args) => {
  try {
    const embed = new Discord.MessageEmbed()
      .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
      .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());
    if (bot.hasPermission('SEND_TTS_MESSAGES'))
      embed.setDescription('The bot has tts permissions')
        .setColor('GREEN');
    else
      embed.setDescription('The bot doesn\'t have tts permissions')
        .setColor('RED');
    message.channel.send(embed).catch(console.error);
  } catch (e) {
    console.error(e);
  }
};

module.exports.help = {
  name: 'hastts',
  description: 'Checks if the bot has text to speech permissions',
  usage: ' ',
  examples: null,
  aliases: null,
  permission: 'dev',
  disabled: false,
};

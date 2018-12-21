// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const defaultEmbed = require('../util/embed');

/**
 * @param {Discord.GuildMember} bot
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {string} command
 * @param {string[]} args
 */
module.exports.run = async (bot, client, config, message, command, args) => {
  try {
    const embed = defaultEmbed(bot, client, message, config, command, args);
    if (bot.hasPermission('SEND_TTS_MESSAGES')) embed.setDescription('The bot has tts permissions').setColor('GREEN');
    else embed.setDescription('The bot doesn\'t have tts permissions').setColor('RED');
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
  disabled: true,
};

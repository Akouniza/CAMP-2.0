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
    if (message.mentions.members.size !== 1) return message.channel.send(embed.setColor('RED').setDescription('Invalid command usage.\nYou must mention exactly one user.')).catch(console.error);
    if (message.mentions.members.first().user.id === message.member.user.id) return message.channel.send(embed.setColor('RED').setDescription('Invalid command usage.\nYou cannot use this command on yourself.')).catch(console.error);
    if (!message.mentions.members.first().roles.has(config.trustedRoleID)) {
      message.mentions.members.first().roles.add(config.trustedRoleID, `${message.author.tag}: ${config.prefix}${command} ${args.join(' ')}`).catch(console.error);
      embed.setDescription(`Gave the trusted role to ${message.mentions.members.first().user.tag}`);
    } else {
      message.mentions.members.first().roles.remove(config.trustedRoleID, `${message.author.tag}: ${config.prefix}${command} ${args.join(' ')}`).catch(console.error);
      embed.setDescription(`Removed the trusted role from ${message.mentions.members.first().user.tag}`);
    }
    embed.setColor('GREEN');
    message.channel.send(embed).catch(console.error);
  } catch (e) {
    console.error(e);
  }
};

module.exports.help = {
  name: 'trusted',
  description: 'Give someone the trusted role (or remove it from them)',
  usage: '<user-mention>',
  examples: ['@AlexejheroYTB#1636'],
  aliases: null,
  permission: 'staff',
  disabled: false,
  donotdelete: true,
};

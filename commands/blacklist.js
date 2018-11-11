const Discord = require('discord.js');
const fs = require('fs');

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
    if (message.mentions.members.size <= 0) return message.channel.send(embed.setColor('RED').setDescription('Invalid command usage\nYou must mention a user.')).catch(console.error);
    const blacklist = require('../blacklist.json');
    if (!blacklist.blacklisted.includes(message.mentions.members.first().id)) {
      blacklist.blacklisted.push(message.mentions.members.first().id);
      fs.writeFile('../blacklist.json', JSON.stringify(blacklist, null, 2));
      embed.setDescription(`${message.mentions.members.first().user.tag} is now blacklisted.`);
    } else {
      blacklist.blacklisted.splice(blacklist.blacklisted.indexOf(message.mentions.members.first().id), 1);
      fs.writeFile('../blacklist.json', JSON.stringify(blacklist, null, 2));
      embed.setDescription(`${message.mentions.members.first().user.tag} is no longer blacklisted.`);
    }
    embed.setColor('GREEN');
    message.channel.send(embed).catch(console.error);
  } catch (e) {
    console.error(e);
  }
};

module.exports.help = {
  name: 'blacklist',
  description: 'Ban someone from using the bot (or unban them)',
  usage: '<user-mention>',
  examples: ['@AlexejheroYTB#1636'],
  aliases: null,
  permission: 'dev',
  disabled: true,
};

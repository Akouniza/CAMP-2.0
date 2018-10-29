const Discord = require('discord.js');

/**
 * @param {Discord.GuildMember} bot
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {string} command
 * @param {string[]} args
 */
module.exports.run = async (bot, client, config, message, command, args) => {
  const embed = new Discord.MessageEmbed()
    .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
    .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL()).setDescription('Loading mod info...');
  if (args.length === 1 && String(Number(args[0])) === args[0]) {
    const embed2 = new Discord.MessageEmbed()
      .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
      .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL())
      .addField('Name', 'Loading')
      .addField('Version', 'Loading...', true)
      .addField('Uploaded by', 'Loading...', true)
      .addField('Endorsements', 'Loading...', true)
      .addField('Views', 'Loading...', true)
      .addField('Total Downloads', 'Loading...', true)
      .addField('Unique Downloads', 'Loading...', true);
    message.channel.send(embed).then(async (msg) => {
      await require('../util/cors.js')({
        method: 'GET',
        url: `nexusmods.com/subnautica/mods/${args[0]}`,
        data: '',
      }, async (data) => {
        if (data === null || data === '') return message.channel.send(embed.setColor('RED').setDescription('Could not get data from NexusMods!')) && client.error(`Could not get data from NexusMods! Mod ID = ${args[0]}`);
        const parsedData = String(data.replace(/<script[^>]*>[^]*?<\/script>/gim, ''));
        // message.channel.send(embed.setDescription(parsedData));
      });
    });
  }
};

module.exports.help = {
  name: 'nexus',
  description: 'Retrieves mod information from nexusmods.com',
  usage: '<id>/<name>',
  examples: ['113', 'SMLHelper V2'],
  aliases: null,
  permission: 'user',
};

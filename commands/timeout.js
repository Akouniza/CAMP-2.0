/* eslint
  no-param-reassign: 1
*/

const Discord = require('discord.js');
const ms = require('ms');

module.exports.run = async (bot, client, config, message, command, args) => {
  const embed = new Discord.MessageEmbed()
    .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
    .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());

  if (args.length === 1 && args[0] === 'end') {
    if (client.timeout.time && client.timeout.channel) {
      const embed2 = new Discord.MessageEmbed().setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL()).setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL()).addField('The timeout period was manually ended.', 'The bot can now be used once again!').setColor('GREEN');
      client.timeout.channel.send(embed2);
      client.timeout.time = 0;
      client.timeout.channel = null;
    } else {
      const embed2 = new Discord.MessageEmbed().setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL()).setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL()).addField('Cannot end timeout!', 'There is no timeout in progress.').setColor('ORANGE');
      message.channel.send(embed2);
    }
  }
  if (client.timeout.time !== 0) {
    embed.addField('Cannot set timeout.', `There is another timeout in progress. ${ms(client.timeout.time)}`).setColor('RED');
    message.channel.send(embed);
    return;
  }
  if (args.join(' ') && ms(args.join(' '))) {
    if (ms(args.join(' ')) < 0) {
      // TODO: Send invalid arguments message
      return;
    }
    client.timeout.time = ms(args.join(' '));
    client.timeout.channel = message.channel;
    embed.addField(`Alright, the bot is disabled for ${ms(ms(args.join(' ')), { long: true })}.`, `To disable the timeout, type \`${config.prefix}timeout end\``).setColor('BLUE');
    message.channel.send(embed);
    const timer = setInterval(() => {
      client.timeout.time -= 1000;
      if (client.timeout.time <= 0 && client.timeout.channel) {
        const embed2 = new Discord.MessageEmbed().setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL()).setFooter('Timeout ended', client.user.avatarURL()).addField('The timeout period has ended.', 'The bot can now be used once again!').setColor('GREEN');
        client.timeout.channel.send(embed2);
        client.timeout.time = 0;
        client.timeout.channel = null;
        clearInterval(timer);
      }
    }, 1000);
  }
};

module.exports.help = {
  name: 'timeout',
  description: 'Disable the bot for a set amount of time',
  usage: '<time>/end',
  examples: ['3s', '5m', '1h', 'end'],
  aliases: null,
  permission: 'owner',
  disabled: true,
};

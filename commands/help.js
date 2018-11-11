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
    const user = new Discord.MessageEmbed()
      .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
      .setTitle('__User Commands__')
      .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());
    const trusted = new Discord.MessageEmbed()
      .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
      .setTitle('__Trusted Commands__')
      .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());
    const staff = new Discord.MessageEmbed()
      .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
      .setTitle('__Staff Commands__')
      .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());
    const owner = new Discord.MessageEmbed()
      .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
      .setTitle('__Owner Commands__')
      .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());
    const dev = new Discord.MessageEmbed()
      .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
      .setTitle('__Developer Commands__')
      .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());

    Array.from(client.commands.values()).forEach((cmd) => {
      const name = `${config.prefix}${cmd.help.name}`;
      const desc = `${cmd.help.description}${cmd.help.usage ? `\n_Usage: \`${name} ${cmd.help.usage}\`_` : ''}${cmd.help.examples && cmd.help.examples.length && Array.isArray(cmd.help.examples) > 0 ? `\n_Examples: \`${name} ${cmd.help.examples.join(`\`, \`${name} `)}\`_` : ''}`;
      if (cmd.help.permission === 'user') {
        user.addField(name, desc);
      }
      if (cmd.help.permission === 'trusted') {
        trusted.addField(name, desc);
      }
      if (cmd.help.permission === 'staff') {
        staff.addField(name, desc);
      }
      if (cmd.help.permission === 'owner') {
        owner.addField(name, desc);
      }
      if (cmd.help.permission === 'dev') {
        dev.addField(name, desc);
      }
    });

    if (user.fields.length >= 1) message.channel.send(user);
    if ((Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.trustedRoleID)) || message.member.id === config.devID) && trusted.fields.length >= 1) message.channel.send(trusted).catch(console.error);
    if ((Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.staffRoleID)) || message.member.id === config.devID) && staff.fields.length >= 1) message.channel.send(staff).catch(console.error);
    if ((Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.ownerRoleID)) || message.member.id === config.devID) && owner.fields.length >= 1) message.channel.send(owner).catch(console.error);
    if (message.member.id === config.devID && dev.fields.length >= 1) message.channel.send(dev).catch(console.error);
  } catch (e) {
    console.error(e);
  }
};

module.exports.help = {
  name: 'help',
  description: 'Shows a list of commands you can use.',
  usage: ' ',
  examples: null,
  aliases: null,
  permission: 'user',
};

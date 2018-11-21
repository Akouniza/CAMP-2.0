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
    const newargs = args;
    newargs.shift();
    const newcommand = newargs.shift().toLowerCase();
    
    const embed = new Discord.MessageEmbed()
      .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
      .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());
    
    if (message.mentions.members.size < 1) return message.channel.send(embed.setColor('RED').setDescription('Invalid command usage.\nYou must mention one user to run the command on.')).catch(console.error);
    if (message.mentions.members.first().user.id === message.member.user.id) return message.channel.send(embed.setColor('RED').setDescription('Invalid command usage.\nWhy are you trying to sudo yourself?')).catch(console.error);
    if (message.mentions.members.first().user.bot) return message.channel.send(embed.setColor('RED').setDescription('Invalid command usage.\nYou cannot sudo a bot.')).catch(console.error);
    if (newargs.length < 1) return message.channel.send(embed.setColor('RED').setDescription('Invalid command usage.\nYou must specify a command to run')).catch(console.error);
    
    message.author = message.mentions.users.first();
    message.content = `${config.prefix}${newcommand} ${newargs.join(' ')}`;
    message.mentions.members.delete(Array.from(message.mentions.members.values())[0]);
    message.mentions.users.delete(Array.from(message.mentions.users.values())[0]);
    
    console.debug(`Running command \`${message.content}\` as <@${message.member.id}>.`);

    const permissions = ['user'];
    if (message.member.id === config.devID) if (client.op) permissions.push('trusted', 'staff', 'owner', 'dev'); else permissions.push('trusted', 'dev');
    else if (Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.ownerRoleID))) permissions.push('trusted', 'staff', 'owner');
    else if (Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.staffRoleID))) permissions.push('trusted', 'staff');
    else if (Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.trustedRoleID))) permissions.push('trusted');
    
    const com = client.commands.get(newcommand);
    if (com) {
      if (permissions.includes(com.help.permission)) return com.run(bot, client, config, message, newcommand, newargs);
      if (com.help.permission2 && permissions.includes(com.help.permission2)) return com.run(bot, client, config, message, newcommand, newargs);
      return message.channel.send(embed.setDescription('You do not have the permission to run this command').addField('Required permission', `${com.help.permission}${com.help.permission2 ? `, ${com.help.permission2}` : ''}`).addField('Your permissions', permissions.join(', ')).setColor('RED'));
    } else {
      return message.channel.send(embed.setColor('RED').setDescription('Invalid command usage.\nThat command does not exist.')).catch(console.error);
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports.help = {
  name: 'sudo',
  description: 'Force another user to run a command',
  usage: ' ',
  examples: null,
  aliases: null,
  permission: 'owner',
  permission2: 'dev',
  disabled: false,
};

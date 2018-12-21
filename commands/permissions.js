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

    const permissions = ['user'];
    if (message.member.id === config.devID) if (client.op) permissions.push('trusted', 'staff', 'owner', 'dev'); else permissions.push('trusted', 'dev');
    else if (Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.ownerRoleID))) permissions.push('trusted', 'staff', 'owner');
    else if (Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.staffRoleID))) permissions.push('trusted', 'staff');
    else if (Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.trustedRoleID))) permissions.push('trusted');

    message.channel.send(embed.addField('Your permissions', permissions.join(', '))).catch(e => message.channel.send(`\`\`\`${e.stack}\`\`\``).catch(xe => console.error(xe.stack)) && console.error(e.stack));
  } catch (e) {
    message.channel.send(`\`\`\`${e.stack}\`\`\``).catch(xe => console.error(xe.stack));
    console.error(e.stack);
  }
};

module.exports.help = {
  name: 'permissions',
  description: 'Gets your permission level',
  usage: ' ',
  examples: null,
  aliases: null,
  permission: 'user',
  disabled: false,
};

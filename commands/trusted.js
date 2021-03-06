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
    if (message.mentions.members.size !== 1) return message.channel.send(embed.setColor('RED').setDescription('Invalid command usage.\nYou must mention exactly one user.')).catch(e => message.channel.send(`\`\`\`${e.stack}\`\`\``).catch(xe => console.error(xe.stack)) && console.error(e.stack));
    if (message.mentions.members.first().user.id === message.member.user.id) return message.channel.send(embed.setColor('RED').setDescription('Invalid command usage.\nYou cannot use this command on yourself.')).catch(e => message.channel.send(`\`\`\`${e.stack}\`\`\``).catch(xe => console.error(xe.stack)) && console.error(e.stack));
    if (!message.mentions.members.first().roles.has(config.trustedRoleID)) {
      message.mentions.members.first().roles.add(config.trustedRoleID, `${message.author.tag}: ${config.prefix}${command} ${args.join(' ')}`).catch(e => message.channel.send(`\`\`\`${e.stack}\`\`\``).catch(xe => console.error(xe.stack)) && console.error(e.stack));
      message.react('✅').catch(e => message.channel.send(`\`\`\`${e.stack}\`\`\``).catch(xe => console.error(xe.stack)) && console.error(e.stack));
    } else {
      message.mentions.members.first().roles.remove(config.trustedRoleID, `${message.author.tag}: ${config.prefix}${command} ${args.join(' ')}`).catch(e => message.channel.send(`\`\`\`${e.stack}\`\`\``).catch(xe => console.error(xe.stack)) && console.error(e.stack));
      message.react('❌').catch(e => message.channel.send(`\`\`\`${e.stack}\`\`\``).catch(xe => console.error(xe.stack)) && console.error(e.stack));
    }
  } catch (e) {
    message.channel.send(`\`\`\`${e.stack}\`\`\``).catch(xe => console.error(xe.stack));
    console.error(e.stack);
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

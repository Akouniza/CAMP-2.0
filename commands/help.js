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
    const embed = defaultEmbed(bot, client, message, config, command, args)
      .setTitle('__Commands__');

    Array.from(client.commands.values()).forEach((cmd) => {
      const name = `${config.prefix}${cmd.help.name}`;
      const desc = `${cmd.help.description}${cmd.help.usage ? `\n_Usage: \`${name} ${cmd.help.usage}\`_` : ''}${cmd.help.examples && cmd.help.examples.length && Array.isArray(cmd.help.examples) > 0 ? `\n_Examples: \`${name} ${cmd.help.examples.join(`\`, \`${name} `)}\`_` : ''}`;
      if (cmd.help.permission === 'dev' && message.member.id === config.devID) {
        embed.addField(name, desc);
      } else if (cmd.help.permission === 'owner' && (Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.ownerRoleID)) || message.member.id === config.devID)) {
        embed.addField(name, desc);
      } else if (cmd.help.permission === 'staff' && (Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.staffRoleID)) || message.member.id === config.devID)) {
        embed.addField(name, desc);
      } else if (cmd.help.permission === 'trusted' && (Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.trustedRoleID)) || message.member.id === config.devID)) {
        embed.addField(name, desc);
      } else if (cmd.help.permission === 'user') {
        embed.addField(name, desc);
      } else {
        embed.addField(`~~${name}~~`, `~~${desc}~~`);
      }
    });

    message.channel.send(embed).catch(e => message.channel.send(`\`\`\`${e.stack}\`\`\``).catch(xe => console.error(xe.stack)) && console.error(e.stack));
  } catch (e) {
    message.channel.send(`\`\`\`${e.stack}\`\`\``).catch(xe => console.error(xe.stack));
    console.error(e.stack);
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

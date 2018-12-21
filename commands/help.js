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
    const user = defaultEmbed(bot, client, message, config, command, args)
      .setTitle('__User Commands__');
    const trusted = defaultEmbed(bot, client, message, config, command, args)
      .setTitle('__Trusted Commands__');
    const staff = defaultEmbed(bot, client, message, config, command, args)
      .setTitle('__Staff Commands__');
    const owner = defaultEmbed(bot, client, message, config, command, args)
      .setTitle('__Owner Commands__');
    const dev = defaultEmbed(bot, client, message, config, command, args)
      .setTitle('__Developer Commands__');

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
    if ((Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.trustedRoleID)) || message.member.id === config.devID) && trusted.fields.length >= 1) message.channel.send(trusted).catch(e => message.channel.send(`\`\`\`${e.stack}\`\`\``).catch(xe => console.error(xe.stack)) && console.error(e.stack));
    if ((Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.staffRoleID)) || message.member.id === config.devID) && staff.fields.length >= 1) message.channel.send(staff).catch(e => message.channel.send(`\`\`\`${e.stack}\`\`\``).catch(xe => console.error(xe.stack)) && console.error(e.stack));
    if ((Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.ownerRoleID)) || message.member.id === config.devID) && owner.fields.length >= 1) message.channel.send(owner).catch(e => message.channel.send(`\`\`\`${e.stack}\`\`\``).catch(xe => console.error(xe.stack)) && console.error(e.stack));
    if (message.member.id === config.devID && dev.fields.length >= 1) message.channel.send(dev).catch(e => message.channel.send(`\`\`\`${e.stack}\`\`\``).catch(xe => console.error(xe.stack)) && console.error(e.stack));
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

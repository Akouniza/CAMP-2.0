// eslint-disable-next-line no-unused-vars
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
    client.user.setUsername(args.join(' ')).then(() => message.react('✅').catch(e => message.channel.send(`\`\`\`${e.stack}\`\`\``).catch(xe => console.error(xe.stack)) && console.error(e.stack))).catch(message.react('❌').catch(e => message.channel.send(`\`\`\`${e.stack}\`\`\``).catch(xe => console.error(xe.stack)) && console.error(e.stack)));
  } catch (e) {
    message.channel.send(`\`\`\`${e.stack}\`\`\``).catch(xe => console.error(xe.stack));
    console.error(e.stack);
  }
};

module.exports.help = {
  name: 'username',
  description: 'Change the username of the bot',
  usage: '<username>',
  examples: ['CAMP'],
  aliases: null,
  permission: 'owner',
  disabled: false,
  donotdelete: true,
};

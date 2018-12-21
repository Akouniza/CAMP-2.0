/* eslint-disable no-eval */
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
    eval(args.join(' '));
    message.react('✅').catch(console.log);
  } catch (e) {
    message.react('❌').catch(console.log);
    message.channel.send(`\`\`\`${e.stack}\`\`\``);
  }
};

module.exports.help = {
  name: 'eval',
  description: 'Evaluate a piece of javascript code',
  usage: '',
  examples: null,
  aliases: null,
  permission: 'dev',
  disabled: false,
};

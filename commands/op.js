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
    if (client.op) {
      client.op = false;
      message.react('❌');
    } else {
      client.op = true;
      message.react('✅');
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports.help = {
  name: 'op',
  description: 'Disables or enables staff/owner permissions (for developing purposes)',
  usage: ' ',
  examples: null,
  aliases: null,
  permission: 'dev',
  disabled: false,
};

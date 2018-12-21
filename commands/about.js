// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const changelog = require('../changelog.json');
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
      .setDescription('CAMP 2.0, the successor of CAMP, is a bot made for the Subnautica Modding discord server.')
      .addField('Author', `<@${message.guild.members.get(config.devID).user.id}>`, true)
      .addField('Version', changelog.version, true)
      .addField('Running from', process.env.token ? 'Heroku' : 'Visual Studio Code', true)
      .addField('Changelog', 'https://announcekit.app/camp-2.0/patch-notes');
    message.channel.send(embed).catch(console.error);
  } catch (e) {
    console.error(e);
  }
};

module.exports.help = {
  name: 'about',
  description: 'Get information about the bot',
  usage: ' ',
  examples: null,
  aliases: null,
  permission: 'user',
  disabled: false,
};

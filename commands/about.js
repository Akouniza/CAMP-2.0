import Discord from 'discord.js';
import { version, items } from '../changelog.json';

/**
 * @param {Discord.GuildMember} bot
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {string} command
 * @param {string[]} args
 */
export async function run(bot, client, config, message, command, args) {
  try {
    const embed = new Discord.MessageEmbed()
      .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
      .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL())
      .setDescription('CAMP 2.0, the successor of CAMP, is a bot made for the Subnautica Modding discord server.')
      .addField('Author', `<@${message.guild.members.get(config.devID).user.id}>`, true)
      .addField('Version', version, true)
      .addField('Running from', process.env.token ? 'Heroku' : 'Visual Studio Code', true)
      .addField('Changes', '• ' + items.join('\n• '));
    message.channel.send(embed).catch(console.error);
  } catch (e) {
    console.error(e);
  }
}

export const help = {
  name: 'about',
  description: 'Get information about the bot',
  usage: ' ',
  examples: null,
  aliases: null,
  permission: 'user',
  disabled: false,
};

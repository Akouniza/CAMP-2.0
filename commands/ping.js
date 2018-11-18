import Discord from 'discord.js';

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
      .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());

    const embed2 = new Discord.MessageEmbed();
    embed2.setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL()).setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL()).addField('Client Latency', 'Calculating...', true).addField('API Latency', 'Calculating...', true);

    message.channel.send(embed2).then((msg) => {
      try {
        const clientLatency = msg.createdTimestamp - message.createdTimestamp;
        const APILatency = Math.round(client.ping);
        embed.addField('Client Latency', `${clientLatency}ms`, true);
        embed.addField('API Latency', `${APILatency}ms`, true);
        if (clientLatency > 1000 || APILatency > 300) embed.setColor('RED');
        else if (clientLatency > 500 || APILatency > 200) embed.setColor('ORANGE');
        else embed.setColor('GREEN');
        msg.edit(embed).catch(console.error);
      } catch (e) {
        console.error(e);
      }
    }).catch(console.error);
  } catch (e) {
    console.error(e);
  }
}

export const help = {
  name: 'ping',
  description: 'Gets the latency of the bot',
  usage: ' ',
  examples: null,
  aliases: null,
  permission: 'user',
};

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

    const embed2 = defaultEmbed(bot, client, message, config, command, args)
      .addField('Client Latency', 'Calculating...', true).addField('API Latency', 'Calculating...', true);

    message.channel.send(embed2).then((msg) => {
      try {
        const clientLatency = msg.createdTimestamp - message.createdTimestamp;
        const APILatency = Math.round(client.ws.ping);
        embed.addField('Client Latency', `${clientLatency}ms`, true);
        embed.addField('API Latency', `${APILatency}ms`, true);
        if (clientLatency > 1000 || APILatency > 300) embed.setColor('RED');
        else if (clientLatency > 500 || APILatency > 200) embed.setColor('ORANGE');
        else embed.setColor('GREEN');
        msg.edit(embed).catch(console.error);
      } catch (e) {
        message.channel.send(`\`\`\`${e.stack}\`\`\``);
        console.error(e.stack);
      }
    }).catch(e => message.channel.send(`\`\`\`${e.stack}\`\`\``) && console.error(e.stack));
  } catch (e) {
    message.channel.send(`\`\`\`${e.stack}\`\`\``);
    console.error(e.stack);
  }
};

module.exports.help = {
  name: 'ping',
  description: 'Gets the latency of the bot',
  usage: ' ',
  examples: null,
  aliases: null,
  permission: 'user',
};

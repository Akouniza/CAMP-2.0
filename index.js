const { Client, MessageEmbed } = require('discord.js');
const ms = require('ms');
/**
 * @type {string}
 */
const token = require('./token.json').token;
/**
 * @type {{ prefix: string, ownerID: string, logChannelID: string, clientID:string }}
 */
const config = require('./config.json');

const client = new Client();

const permission = Object.freeze({
  user: 0,
  staff: 1,
  owner: 2,
  dev: 3,
});

/**
 * @returns {{name:string,description:string,permission:number}}
 * @param {string} name
 * @param {string} description
 * @param {number} permission
 */
function cmd(name, description, permission_) {
  return { name, description, permission_ };
}

/** @type {{name:string,description:string,permission:number}[]} */
const commands = [
  cmd('help', 'See a list of commands you can use', permission.user),
  cmd('ping', 'Get the latency of the bot', permission.user),
];

/** @type {{time: number, channel: "TextChannel" | "DMChannel" | "GroupDMChannel"}} */
const timeout = { time: 0, channel: null };

client.on('ready', () => {
  const presence = {
    status: 'online',
    afk: false,
    activity: {
      name: `${config.prefix}help`,
      type: 'PLAYING',
      url: 'https://github.com/AlexejheroYTB/CAMP-2.0',
    },
  };
  client.user.setPresence(presence);
});

client.on('message', (message) => {
  const bot = message.guild.members.get(client.user.id);

  if (message.author.bot) return;

  if (!message.content.indexOf(config.prefix) === 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const embed = new MessageEmbed()
    .setAuthor(bot.nickname !== undefined ? bot.nickname : bot.user.username, client.user.avatarURL())
    .setFooter(`${message.member.nickname !== undefined ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());

  if (timeout.time > 0) if (command !== 'timeout') return message.channel.send(embed.setDescription(`The bot is disabled for ${ms(timeout.time, { long: true })}.`).setColor('RED'));

  if (!bot.hasPermission('ADMINISTRATOR')) {
    const logembed = new MessageEmbed()
      .setColor('RED')
      .setAuthor(bot.nickname !== undefined ? bot.nickname : bot.user.username, client.user.avatarURL())
      .addField('ERROR! The bot does not have administrator permissions!', '(I am too lazy to check for individual permissions)')
      .setFooter(`${message.member.nickname !== undefined ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());
    message.guild.channels.get(config.logChannelID).send(logembed);
    embed.addField('An error occured!', 'Please contact an admin to check the log').setColor('RED');
    message.channel.send(embed);
    return;
  }

  // TODO! Use command handler
  // TODO: Use async
  switch (command) {
    case 'help':
      commands.forEach(({ name, description, permission: perm }) => {
        embed.addField(config.prefix + name, description);
      });
      message.channel.send(embed);
      break;

    case 'timeout':
    case 'fuckoff':
      if (args.length === 1 && args[0] === 'end') {
        const embed2 = new MessageEmbed().setAuthor(bot.nickname !== undefined ? bot.nickname : bot.user.username, client.user.avatarURL()).setFooter(`${message.member.nickname !== undefined ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL()).addField('The timeout period was manually ended.', 'The bot can now be used once again!').setColor('GREEN');
        timeout.channel.send(embed2);
        timeout.time = 0;
        timeout.channel = null;
      }
      if (timeout.time !== 0) {
        embed.addField('Cannot set timeout.', `There is another timeout in progress. ${ms(timeout.time)}`).setColor('RED');
        message.channel.send(embed);
      }
      if (args.join(' ')) {
        timeout.time = args.join(' ');
        timeout.channel = message.channel;
        if (ms(args.join(' ')) < 0) {
          // TODO: Send invalid arguments message
          return;
        }
        embed.addField(`Alright, the bot is disabled for ${ms(args.join(' '), { long: true })}.`, `To disable the timeout, type \`${config.prefix}timeout end\``).setColor('RED');
        message.channel.send(embed);
        const timer = setInterval(() => {
          timeout.time -= 1000;
          if (timeout.time <= 0) {
            const embed2 = new MessageEmbed().setAuthor(bot.nickname !== undefined ? bot.nickname : bot.user.username, client.user.avatarURL()).setFooter('Timeout ended', client.user.avatarURL()).addField('The timeout period has ended.', 'The bot can now be used once again!').setColor('GREEN');
            timeout.channel.send(embed2);
            timeout.time = 0;
            timeout.channel = null;
            clearInterval(timer);
          }
        }, 1000);
      }
      break;

    case 'ping':
      const embed2 = new MessageEmbed();
      embed2.setAuthor(bot.nickname !== undefined ? bot.nickname : bot.user.username, client.user.avatarURL()).setFooter(`${message.member.nickname !== undefined ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL()).addField('Client Latency', 'Calculating...', true).addField('API Latency', 'Calculating...', true);
      message.channel.send(embed2).then((msg) => {
        const clientLatency = msg.createdTimestamp - message.createdTimestamp;
        const APILatency = Math.round(client.ping);
        embed.addField('Client Latency', `${clientLatency}ms`, true);
        embed.addField('API Latency', `${APILatency}ms`, true);
        if (clientLatency > 1000 || APILatency > 300) embed.setColor('RED');
        else if (clientLatency > 500 || APILatency > 200) embed.setColor('ORANGE');
        else embed.setColor('GREEN');
        msg.edit(embed);
      });
  }
});

client.login(token);

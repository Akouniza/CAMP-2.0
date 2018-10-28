const Discord = require('discord.js');
const ms = require('ms');
const token = require('./token.json').token;
const config = require('./config.json');

const client = new Discord.Client();

client.timeout = { time: 0, channel: null };
client.commands = new Discord.Collection();

client.on('ready', async () => {
  await require('./events/ready/logging.js')(client, config);
  await require('./events/ready/loadcommands.js')(client);
  await require('./events/ready/setpresence.js')(client, config);

  client.log(`Logged in as '${client.user.tag}'`);
});

client.on('message', (message) => {
  const bot = message.guild.members.get(client.user.id);

  if (message.author.bot) return;

  if (!message.content.indexOf(config.prefix) === 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const embed = new Discord.MessageEmbed()
    .setAuthor(bot.nickname !== undefined ? bot.nickname : bot.user.username, client.user.avatarURL())
    .setFooter(`${message.member.nickname !== undefined ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());

  if (client.timeout.time > 0) if (command !== 'timeout') return message.channel.send(embed.setDescription(`The bot is disabled for ${ms(client.timeout.time, { long: true })}.`).setColor('RED'));

  if (!bot.hasPermission('ADMINISTRATOR')) {
    client.error('The bot does not have admin permissions!');
    const logembed = new Discord.MessageEmbed()
      .setColor('RED')
      .setAuthor(bot.nickname !== undefined ? bot.nickname : bot.user.username, client.user.avatarURL())
      .addField('ERROR! The bot does not have administrator permissions!', '(I am too lazy to check for individual permissions)')
      .setFooter(`${message.member.nickname !== undefined ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());
    message.guild.channels.get(config.logChannelID).send(logembed);
    embed.addField('An error occured!', 'Please contact an admin to check the log').setColor('RED');
    message.channel.send(embed);
    return;
  }

  const com = client.commands.get(command);
  if (com) return com.run(bot, client, config, message, command, args);
});

client.login(token);

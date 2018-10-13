const Discord = require('discord.js');
const ms = require('ms');
const fs = require('fs');
const token = require('./token.json').token;
const config = require('./config.jsonc');

const client = new Discord.Client();

client.timeout = { time: 0, channel: null };
client.commands = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
  // // if (err) console.error(err);
  const jsfiles = files.filter(f => f.split('.').pop() === 'js');

  if (jsfiles.length <= 0) return; // // console.warn('There are no commands to load...');

  // // console.debug(`Loading ${jsfiles.length} commands...`);

  jsfiles.forEach((f) => {
    const props = require(`./commands/${f}`);
    // // console.log('Loading command x...');
    client.commands.set(props.help.name, props);
  });
});

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

  const embed = new Discord.MessageEmbed()
    .setAuthor(bot.nickname !== undefined ? bot.nickname : bot.user.username, client.user.avatarURL())
    .setFooter(`${message.member.nickname !== undefined ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());

  if (client.timeout.time > 0) if (command !== 'timeout') return message.channel.send(embed.setDescription(`The bot is disabled for ${ms(client.timeout.time, { long: true })}.`).setColor('RED'));

  if (!bot.hasPermission('ADMINISTRATOR')) {
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

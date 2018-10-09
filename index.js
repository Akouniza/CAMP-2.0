/* eslint
  prefer-destructuring: 0,
  no-console: 0,
  no-unused-vars: 1,
  max-len: 0,
  no-trailing-spaces: 1,
  semi-style: 1,
  prefer-template: 1,
  semi: 1,
*/

const { Client, MessageEmbed } = require('discord.js');
/** @type {string} */ const token = require('./token.json').token;
/** @type {{prefix:string,ownerID:string}} */ const config = require('./config.json');

const client = new Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (message) => {
  if (message.author.bot) return;

  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    message.channel.send('_ _').then((msg) => {
      const dembed = {
        footer: {
          icon_url: '<user icon>',
          text: '<user name> | <command>',
        },
        author: {
          name: '<bot name>',
          icon_url: '<bot icon>',
        },
        fields: [
          {
            name: 'Client Latency',
            value: '223ms',
            inline: true,
          },
          {
            name: 'API Latency',
            value: '49ms',
            inline: true,
          },
        ],
      };
      const clientLatency = msg.createdTimestamp - message.createdTimestamp;
      const APILatency = Math.round(client.ping);
      const bot = message.guild.members.get(client.user.id);
      const embed = new MessageEmbed()
        .setAuthor(bot.nickname !== undefined ? bot.nickname : bot.user.username, client.user.avatarURL())
        .setFooter(`${message.member.nickname !== undefined ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL())
        .addField('Client Latency', clientLatency, true)
        .addField('API Latency', APILatency, true);
      if (clientLatency > 1000 || APILatency > 300) embed.setColor('RED');
      else if (clientLatency > 500 || APILatency > 200) embed.setColor('ORANGE');
      else embed.setColor('GREEN');
      msg.edit(embed);
    });
  }
});

client.login(token);

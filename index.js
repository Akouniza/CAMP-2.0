/* eslint
  prefer-destructuring: 0,
  no-console: 0,
  no-unused-vars: 1
*/

const Discord = require('discord.js');
/** @type {string} */ const token = require('./token.json').token;

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (message) => {
  if (message.author.bot) return;

  const args = message.content.split(/ +/g);
  const command = args.shift().toLowerCase();

  if (message.content === 'ping') {
    message.reply('Pong!');
  }
});

client.login(token);

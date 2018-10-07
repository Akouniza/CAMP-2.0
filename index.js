/* eslint
  prefer-destructuring: 0,
  no-console: 0,
*/

/* tslint:disable */

const Discord = require('discord.js');
const token = require('./token.json').token;

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (message) => {
  if (message.author.bot) return;

  if (message.content === 'ping') {
    message.reply('Pong!');
  }
});

client.login(token);

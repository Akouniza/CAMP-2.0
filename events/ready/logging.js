/* eslint-disable no-unused-vars */
const Discord = require('discord.js');

/**
 * @param {Discord.Client} client
 */
module.exports = async (client, config) => {
  const temp = [];
  console.debug = (info, params) => {
    client.emit('debug', info);
  };
  console.log = (info, params) => {
    client.emit('info', info);
  };
  console.info = (info, params) => {
    client.emit('info', info);
  };
  console.warn = (info, params) => {
    client.emit('warn', info);
  };
  console.error = (info, params) => {
    client.emit('error', info);
  };
  console.exception = (info, params) => {
    client.emit('error', info);
  };

  client.debug = message => console.debug(message);
  client.log = message => console.log(message);
  client.info = message => console.info(message);
  client.warn = message => console.warn(message);
  client.error = message => console.error(message);
  client.exception = message => console.error(message);

  client.on('debug', (s) => {
    if (temp.includes(s)) {
      temp.splice(temp.indexOf(s), 1);
    } else {
      temp.push(s);
      client.channels.get(config.consoleChannelID).send(new Discord.MessageEmbed().setAuthor('Debug').setDescription(s));
    }
  });
  client.on('info', (s) => {
    if (temp.includes(s)) {
      temp.splice(temp.indexOf(s), 1);
    } else {
      temp.push(s);
      client.channels.get(config.consoleChannelID).send(new Discord.MessageEmbed().setAuthor('Log').setDescription(s).setColor('BLUE'));
    }
  });
  client.on('warn', (s) => {
    if (temp.includes(s)) {
      temp.splice(temp.indexOf(s), 1);
    } else {
      temp.push(s);
      client.channels.get(config.consoleChannelID).send(new Discord.MessageEmbed().setAuthor('Warn').setDescription(s).setColor('ORANGE'));
    }
  });
  client.on('error', (s) => {
    if (temp.includes(s)) {
      temp.splice(temp.indexOf(s), 1);
    } else {
      temp.push(s);
      client.channels.get(config.consoleChannelID).send(new Discord.MessageEmbed().setAuthor('Error').setDescription(s).setColor('RED'));
    }
  });
};

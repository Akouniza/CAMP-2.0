/* eslint-disable no-unused-vars */
const Discord = require('discord.js');

/**
 * @param {Discord.Client} client
 */
module.exports = async (client, config) => {
  const debug = console.debug;
  const log = console.log;
  const info = console.info;
  const warn = console.warn;
  const error = console.error;
  const exception = console.exception;

  console.debug = (info, params) => {
    client.emit('debug', info);
    debug(info, params);
  };
  console.log = (info, params) => {
    client.emit('info', info);
    log(info, params);
  };
  console.info = (info, params) => {
    client.emit('info', info);
    info(info, params);
  };
  console.warn = (info, params) => {
    client.emit('warn', info);
    warn(info, params);
  };
  console.error = (info, params) => {
    client.emit('error', info);
    error(info, params);
  };
  console.exception = (info, params) => {
    client.emit('error', info);
    exception(info, params);
  };

  client.debug = message => console.debug(message);
  client.log = message => console.log(message);
  client.info = message => console.info(message);
  client.warn = message => console.warn(message);
  client.error = message => console.error(message);
  client.exception = message => console.error(message);

  client.on('debug', (s) => {
    client.channels.get(config.consoleChannelID).send(new Discord.MessageEmbed().setAuthor('Debug').setDescription(s));
  });
  client.on('info', (s) => {
    client.channels.get(config.consoleChannelID).send(new Discord.MessageEmbed().setAuthor('Log').setDescription(s).setColor('BLUE'));
  });
  client.on('warn', (s) => {
    client.channels.get(config.consoleChannelID).send(new Discord.MessageEmbed().setAuthor('Warn').setDescription(s).setColor('ORANGE'));
  });
  client.on('error', (s) => {
    client.channels.get(config.consoleChannelID).send(new Discord.MessageEmbed().setAuthor('Error').setDescription(s).setColor('RED'));
  });
};

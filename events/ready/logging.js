const Discord = require('discord.js');

/**
 * @param {Discord.Client} client
 */
module.exports = async (client, config) => {
  const temp = [];
  const cons = console;
  console.debug = (info, params) => {
    if (temp.includes(info) || info.toLowerCase().includes('heartbeat')) {
      temp.splice(temp.indexOf(info), 1);
    } else {
      temp.push(info);
      if (params) cons.debug(info, ...params);
      else cons.debug(info);
      client.emit('debug', info);
    }
  };
  console.log = (info, params) => {
    if (temp.includes(info) || info.toLowerCase().includes('heartbeat')) {
      temp.splice(temp.indexOf(info), 1);
    } else {
      temp.push(info);
      if (params) cons.log(info, ...params);
      else cons.log(info);
      client.emit('info', info);
    }
  };
  console.info = (info, params) => {
    if (temp.includes(info) || info.toLowerCase().includes('heartbeat')) {
      temp.splice(temp.indexOf(info), 1);
    } else {
      temp.push(info);
      if (params) cons.log(info, ...params);
      else cons.log(info);
      client.emit('info', info);
    }
  };
  console.warn = (info, params) => {
    if (temp.includes(info) || info.toLowerCase().includes('heartbeat')) {
      temp.splice(temp.indexOf(info), 1);
    } else {
      temp.push(info);
      if (params) cons.log(info, ...params);
      else cons.log(info);
      client.emit('warn', info);
    }
  };
  console.error = (info, params) => {
    if (temp.includes(info) || info.toLowerCase().includes('heartbeat')) {
      temp.splice(temp.indexOf(info), 1);
    } else {
      temp.push(info);
      if (params) cons.log(info, ...params);
      else cons.log(info);
      client.emit('error', info);
    }
  };

  client.debug = message => console.debug(message);
  client.log = message => console.log(message);
  client.info = message => console.info(message);
  client.warn = message => console.warn(message);
  client.error = message => console.error(message);

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

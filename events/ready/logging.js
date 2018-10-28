const Discord = require('discord.js');

/**
 * @param {Discord.Client} client
 */
module.exports = async (client, config) => {
  client.debug = (message) => {
    client.channels.get(config.consoleChannelID).send(new Discord.MessageEmbed().setDescription(message).setAuthor('Debug'));
    console.debug(message);
  };

  client.log = (message) => {
    client.channels.get(config.consoleChannelID).send(new Discord.MessageEmbed().setDescription(message).setAuthor('Log').setColor('BLUE'));
    console.log(message);
  };

  client.warn = (message) => {
    client.channels.get(config.consoleChannelID).send(new Discord.MessageEmbed().setDescription(message).setAuthor('Warn').setColor('ORANGE'));
    console.warn(message);
  };

  client.error = (message) => {
    client.channels.get(config.consoleChannelID).send(new Discord.MessageEmbed().setDescription(message).setAuthor('Error').setColor('RED'));
    console.warn(message);
  };
};

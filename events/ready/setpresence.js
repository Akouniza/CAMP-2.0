/**
 * @param {Discord.Client} client
 */
module.exports = async (client, config) => {
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
};

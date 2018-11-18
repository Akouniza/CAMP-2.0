/**
 * @param {Discord.Client} client
 */
module.exports = async (client, config) => {
  // eslint-disable-next-line no-unused-vars
  const presence = {
    status: 'online',
    afk: false,
    activity: {
      name: `${config.prefix}help`,
      type: 'PLAYING',
      url: 'https://github.com/AlexejheroYTB/CAMP-2.0',
    },
  };
  const offline = { status: 'offline' };
  client.user.setPresence(offline);
};

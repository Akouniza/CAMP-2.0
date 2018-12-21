try {
  const Discord = require('discord.js');
  const ms = require('ms');
  const config = process.env.dev === 'false' ? require('./config.json') : require('./dev-config.json');
  const token = process.env.dev === 'false' ? process.env.token : (process.env.devtoken ? process.env.devtoken : require('./token.json').devtoken);
  const defaultEmbed = require('./util/embed');

  const client = new Discord.Client();

  // //client.timeout = { time: 0, channel: null };
  client.commands = new Discord.Collection();

  client.on('ready', async () => {
    try {
      await require('./events/ready/logging.js')(client, config);

      console.log('Starting bot...');

      await require('./events/ready/loadcommands.js')(client);
      await require('./events/ready/setpresence.js')(client, config);

      console.log(`Logged in as '${client.user.tag}'`);
    } catch (e) {
      console.error(e);
    }
  });

  client.on('message', (message) => {
    try {
      const bot = message.guild.members.get(client.user.id);

      if (message.author.bot) return;

      if (!message.content.startsWith(config.prefix)) return;

      const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

      const embed = defaultEmbed(bot, client, message, config, command, args);

      // //if (client.timeout.time > 0) if (command !== 'timeout') return message.channel.send(embed.setDescription(`The bot is disabled for ${ms(client.timeout.time, { long: true })}.`).setColor('RED'));

      const permissions = ['user'];
      if (message.member.id === config.devID) permissions.push('trusted', 'staff', 'owner', 'dev');
      else if (Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.ownerRoleID))) permissions.push('trusted', 'staff', 'owner');
      else if (Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.staffRoleID))) permissions.push('trusted', 'staff');
      else if (Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.trustedRoleID))) permissions.push('trusted');

      const com = client.commands.get(command);
      if (com) {
        if (permissions.includes(com.help.permission)) {
          if (!com.help.donotdelete) message.delete();
          return com.run(bot, client, config, message, command, args);
        }
        message.delete();
        return message.channel.send(embed.setDescription('You do not have the permission to run this command').addField('Required permission', com.help.permission).addField('Your permissions', permissions.join(', ')).setColor('RED'));
      }
    } catch (e) {
      console.error(e);
    }
  });

  client.login(token).catch(console.error);
} catch (err) {
  console.error(err);
}

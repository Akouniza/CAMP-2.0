try {
  const Discord = require('discord.js');
  const ms = require('ms');
  const config = process.env.dev === 'false' ? require('./config.json') : require('./dev-config.json');
  const token = process.env.dev === 'false' ? process.env.token : (process.env.devtoken ? process.env.devtoken : require('./token.json').devtoken);

  const client = new Discord.Client();

  client.timeout = { time: 0, channel: null };
  client.commands = new Discord.Collection();
  client.op = false;

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

      if (!message.content.indexOf(config.prefix) === 0) return;

      const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

      const embed = new Discord.MessageEmbed()
        .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
        .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());

      if (client.timeout.time > 0) if (command !== 'timeout') return message.channel.send(embed.setDescription(`The bot is disabled for ${ms(client.timeout.time, { long: true })}.`).setColor('RED'));

      const permissions = ['user'];
      if (message.member.id === config.devID) if (client.op) permissions.push('trusted', 'staff', 'owner', 'dev'); else permissions.push('trusted', 'dev');
      else if (Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.ownerRoleID))) permissions.push('trusted', 'staff', 'owner');
      else if (Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.staffRoleID))) permissions.push('trusted', 'staff');
      else if (Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.trustedRoleID))) permissions.push('trusted');

      const com = client.commands.get(command);
      if (com) {
        if (permissions.includes(com.help.permission)) return com.run(bot, client, config, message, command, args);
        if (com.help.permission2 && permissions.includes(com.help.permission2)) return com.run(bot, client, config, message, command, args);
        return message.channel.send(embed.setDescription('You do not have the permission to run this command').addField('Required permission', com.help.permission).addField('Your permissions', permissions.join(', ')).setColor('RED'));
    } catch (e) {
      console.error(e);
    }
  });

  client.login(token).catch(console.error);
} catch (err) {
  console.error(err);
}

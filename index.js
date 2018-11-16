try {
  const Discord = require('discord.js');
  const ms = require('ms');
  const config = process.env.token ? require('./config.json') : require('./dev-config.json');

  const client = new Discord.Client();

  client.timeout = { time: 0, channel: null };
  client.commands = new Discord.Collection();

  client.on('ready', async () => {
    await require('./events/ready/logging.js')(client, config);

    console.log('Starting bot...');

    await require('./events/ready/loadcommands.js')(client);
    await require('./events/ready/setpresence.js')(client, config);

    console.log(`Logged in as '${client.user.tag}'`);
  });

  client.on('message', (message) => {
    const bot = message.guild.members.get(client.user.id);

    if (message.author.bot) return;

    if (!message.content.indexOf(config.prefix) === 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const embed = new Discord.MessageEmbed()
      .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
      .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());

    if (client.timeout.time > 0) if (command !== 'timeout') return message.channel.send(embed.setDescription(`The bot is disabled for ${ms(client.timeout.time, { long: true })}.`).setColor('RED'));

    if (!bot.hasPermission('ADMINISTRATOR')) {
      console.error('The bot does not have admin permissions!');
      const logembed = new Discord.MessageEmbed()
        .setColor('RED')
        .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
        .addField('ERROR! The bot does not have administrator permissions!', 'The bot requires administrator permissions to ensure that it can respond to commands in any channel and have all of the required permissions (they are not checked for)')
        .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());
      message.guild.channels.get(config.logChannelID).send(logembed);
      embed.addField('An error occured!', 'Please contact an admin to check the log').setColor('RED');
      message.channel.send(embed);
      return;
    }

    const permissions = ['user'];
    if (message.member.id === config.devID) permissions.push('trusted', 'staff', 'owner', 'dev');
    else if (Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.ownerRoleID))) permissions.push('trusted', 'staff', 'owner');
    else if (Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.staffRoleID))) permissions.push('trusted', 'staff');
    else if (Array.from(message.member.roles.values()).includes(message.member.guild.roles.get(config.trustedRoleID))) permissions.push('trusted');

    const com = client.commands.get(command);
    if (com) {
      if (!permissions.includes(com.help.permission)) return message.channel.send(embed.setDescription('You do not have the permission to run this command').addField('Required permission', com.help.permission).addField('Your permissions', permissions.join(', ')).setColor('RED'));
      return com.run(bot, client, config, message, command, args);
    }
  });

  client.login(process.env.token ? process.env.token : require('./token.json').token).catch(console.error);
} catch (err) {
  console.error(err);
}

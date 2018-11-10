const Discord = require('discord.js');

/**
 * @param {Discord.GuildMember} bot
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {string} command
 * @param {string[]} args
 */
module.exports.run = async (bot, client, config, message, command, args) => {
  const embed = new Discord.MessageEmbed()
    .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
    .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());
  if (args.length === 1 && String(Number(args[0])) === args[0]) {
    const embed2 = new Discord.MessageEmbed()
      .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
      .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());
    message.channel.send(embed.setDescription('Loading mod information...')).then(async (msg) => {
      await require('../util/cors.js')({
        method: 'GET',
        url: `nexusmods.com/subnautica/mods/${args[0]}`,
        data: '',
      }, async (data) => {
        if (!data || data === '') return msg.edit(embed2.setColor('RED').setDescription('Could not get data from NexusMods!')) && client.error(`Could not get data from NexusMods! Mod ID = ${args[0]}`);

        if (String(data).includes('The mod you were looking for couldn\'t be found')) return msg.edit(embed2.setColor('ORANGE').setDescription('The mod you were looking for couldn\'t be found.'));

        const parsedData = String(data.replace(/<script[^>]*>[^]*?<\/script>/gim, ''));

        let name = String(parsedData.match(/<h1>.*<\/h1>/gim));
        name = name.substring(4, name.length - 5);
        embed2.addField('Name', name);

        embed2.addField('Link', `https://nexusmods.com/subnautica/mods/${args[0]}`);

        let versionText = String(parsedData.match(/<li class="stat-version">[^]*?<\/li>/gim));
        versionText = String(versionText.match(/<div class="stat">[^]*?<\/div>/gim));
        versionText = String(versionText.match(/>.+?(?=<)/gim));
        versionText = versionText.substring(1);
        embed2.addField('Version', versionText, true);

        let uploader = String(parsedData.match(/users\/[0-9]+?">.*(?=<\/a>)/));
        uploader = uploader.substring(16);
        embed2.addField('Uploaded by', uploader, true);

        let likes = String(parsedData.match(/mfp-zoom-in">[0-9]+(?=<\/a>)/gim));
        likes = likes.substring(13);
        embed2.addField('Endorsements', likes, true);

        let views = String(parsedData.match(/<div class="titlestat">Total views<\/div>[^]{100}/gim));
        views = String(views.match(/[0-9,]/gim));
        views = views.replace(/,/gim, '');
        embed2.addField('Views', views, true);

        let udls = String(parsedData.match(/<div class="titlestat">Unique DLs<\/div>[^]{100}/gim));
        udls = String(udls.match(/[0-9,]/gim));
        udls = udls.replace(/,/gim, '');
        embed2.addField('Unique Downloads', udls, true);

        let tdls = String(parsedData.match(/<div class="titlestat">Total DLs<\/div>[^]{100}/gim));
        tdls = String(tdls.match(/[0-9,]/gim));
        tdls = tdls.replace(/,/gim, '');
        embed2.addField('Total Downloads', tdls, true);

        let imagelink = String(parsedData.match(/"background-image: url(.*?)"/gim));
        imagelink = imagelink.substring(24, imagelink.length - 3);
        embed2.setImage(imagelink);

        msg.edit(embed2.setColor('BLUE'));
      });
    });
  } else {
    const embed2 = new Discord.MessageEmbed()
      .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
      .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());
    message.channel.send(embed.setDescription('Searching for matching mods...')).then(async (msg) => {
      await require('../util/cors.js')({
        method: 'GET',
        url: `nexusmods.com/subnautica/search?gsearch=${encodeURI(args.join(' '))}`,
        data: '',
      }, async (data) => {
        if (!data || data === '') return msg.edit(embed2.setColor('RED').setDescription('Could not get data from NexusMods!')) && client.error(`Could not get data from NexusMods! Mod ID = ${args[0]}`);

        if (String(data).includes('No result')) return msg.edit(embed2.setColor('ORANGE').setDescription('There are no matching results.'));

        const parsedData = String(data.replace(/<script[^>]*>[^]*?<\/script>/gim, ''));

        let matches = String(parsedData.match(/Found [0-9]* results/gim));
        matches = Number(matches.match(/[0-9]+/gim));

        if (matches > 20) {
          return msg.edit(embed2.setColor('ORANGE').setDescription(`There are too many matching results. (${matches})`));
        }

        if (matches === 1) {
          let match = String(parsedData.match(/<a href="https:\/\/www.nexusmods.com\/subnautica\/mods\/[0-9]+">.*<\/a>/gim)[0]);
          match = String(match.match(/[0-9]*/gim));
          match = match.replace(/,,,,,,,,,,2,,,,,,,,,,/gim, '');
          match = match.replace(/,/gim, '');

          const embed3 = new Discord.MessageEmbed()
            .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
            .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());

          return msg.edit(embed2.setDescription('Found one matching result. Getting mod information...')).then(async (msg_) => {
            await require('../util/cors.js')({
              method: 'GET',
              url: `nexusmods.com/subnautica/mods/${match}`,
              data: '',
            }, async (data_) => {
              if (!data_ || data_ === '') return msg_.edit(embed3.setColor('RED').setDescription('Could not get data from NexusMods!')) && client.error(`Could not get data from NexusMods! Mod ID = ${match}`);

              if (String(data_).includes('The mod you were looking for couldn\'t be found')) return msg_.edit(embed3.setColor('ORANGE').setDescription('The mod you were looking for couldn\'t be found.'));

              // eslint-disable-next-line no-underscore-dangle
              const parsedData_ = String(data_.replace(/<script[^>]*>[^]*?<\/script>/gim, ''));

              let name = String(parsedData_.match(/<h1>.*<\/h1>/gim));
              name = name.substring(4, name.length - 5);
              embed3.addField('Name', name);

              embed3.addField('Link', `https://nexusmods.com/subnautica/mods/${args[0]}`);

              let versionText = String(parsedData_.match(/<li class="stat-version">[^]*?<\/li>/gim));
              versionText = String(versionText.match(/<div class="stat">[^]*?<\/div>/gim));
              versionText = String(versionText.match(/>.+?(?=<)/gim));
              versionText = versionText.substring(1);
              embed3.addField('Version', versionText, true);

              let uploader = String(parsedData_.match(/users\/[0-9]+?">.*(?=<\/a>)/));
              uploader = uploader.substring(16);
              embed3.addField('Uploaded by', uploader, true);

              let likes = String(parsedData_.match(/mfp-zoom-in">[0-9]+(?=<\/a>)/gim));
              likes = likes.substring(13);
              embed3.addField('Endorsements', likes, true);

              let views = String(parsedData_.match(/<div class="titlestat">Total views<\/div>[^]{100}/gim));
              views = String(views.match(/[0-9,]/gim));
              views = views.replace(/,/gim, '');
              embed3.addField('Views', views, true);

              let udls = String(parsedData_.match(/<div class="titlestat">Unique DLs<\/div>[^]{100}/gim));
              udls = String(udls.match(/[0-9,]/gim));
              udls = udls.replace(/,/gim, '');
              embed3.addField('Unique Downloads', udls, true);

              let tdls = String(parsedData_.match(/<div class="titlestat">Total DLs<\/div>[^]{100}/gim));
              tdls = String(tdls.match(/[0-9,]/gim));
              tdls = tdls.replace(/,/gim, '');
              embed3.addField('Total Downloads', tdls, true);

              let imagelink = String(parsedData_.match(/"background-image: url(.*?)"/gim));
              imagelink = imagelink.substring(24, imagelink.length - 3);
              embed3.setImage(imagelink);

              msg_.edit(embed3.setColor('BLUE'));
            });
          });
        }

        msg.edit(embed2.setColor('BLUE'));
      });
    });
  }
};

module.exports.help = {
  name: 'nexus',
  description: 'Retrieves mod information from nexusmods.com',
  usage: '<id>/<name>',
  examples: ['113', 'SMLHelper V2'],
  aliases: null,
  permission: 'user',
  disabled: true,
};

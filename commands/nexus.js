const Discord = require('discord.js');

function getModInfo(embed3, parsedData_, match) {
  try {
    let name = String(parsedData_.match(/<h1>.*<\/h1>/gim));
    name = name.substring(4, name.length - 5);
    embed3.addField('Name', name);

    embed3.addField('Link', `https://nexusmods.com/subnautica/mods/${match}`);

    let description = String(parsedData_.match(/<p>[^]*?<\/p>/gim)[0]);
    description = description.substring(3, description.length - 4);
    description = description.replace(/<br\s*\/>/gim, '');
    embed3.addField('Description', description);

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
  } catch (e) {
    console.error(e);
  }
}

/**
 * @type {string[]}
 */
const cancelledActions = [];

/**
 * @param {Discord.GuildMember} bot
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {string} command
 * @param {string[]} args
 */
module.exports.run = async (bot, client, config, message, command, args) => {
  try {
    const embed = new Discord.MessageEmbed()
      .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
      .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());
    if (args.length === 1 && String(Number(args[0])) === args[0]) {
      const embed2 = new Discord.MessageEmbed()
        .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
        .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());
      message.channel.send(embed.setDescription('Loading mod information...')).then(async (msg) => {
        try {
          await require('../util/cors.js')({
            method: 'GET',
            url: `nexusmods.com/subnautica/mods/${args[0]}`,
            data: '',
          }, async (data) => {
            try {
              /** @type {Discord.Message} */
              if (!data || data === '') return msg.edit(embed2.setColor('RED').setDescription('Could not get data from NexusMods!')).catch(console.error) && console.error(`Could not get data from NexusMods! Mod ID = ${args[0]}`);

              if (String(data).includes('The mod you were looking for couldn\'t be found')) return msg.edit(embed2.setColor('ORANGE').setDescription('The mod you were looking for couldn\'t be found.')).catch(console.error);

              const parsedData = String(data.replace(/<script[^>]*>[^]*?<\/script>/gim, ''));

              getModInfo(embed2, parsedData, args[0]);

              msg.edit(embed2.setColor('BLUE')).catch(console.error);
            } catch (e) {
              console.error(e);
            }
          });
        } catch (e) {
          console.error(e);
        }
      }).catch(console.error);
    } else {
      try {
        const embed2 = new Discord.MessageEmbed()
          .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
          .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());
        message.channel.send(embed.setDescription('Searching for matching mods...')).then(async (_msg_) => {
          try {
            /** @type {Discord.Message} */
            const msg = _msg_;
            await require('../util/cors.js')({
              method: 'GET',
              url: `nexusmods.com/subnautica/search?gsearch=${encodeURI(args.join(' '))}`,
              data: '',
            }, async (data) => {
              try {
                if (!data || data === '') return msg.edit(embed2.setColor('RED').setDescription('Could not get data from NexusMods!')).catch(console.error) && console.error(`Could not get data from NexusMods! Mod ID = ${args[0]}`);

                if (String(data).includes('No result')) return msg.edit(embed2.setColor('ORANGE').setDescription('There are no matching results.')).catch(console.error);

                const parsedData = String(data.replace(/<script[^>]*>[^]*?<\/script>/gim, ''));

                let matchesno = String(parsedData.match(/Found [0-9]* results/gim));
                matchesno = Number(matchesno.match(/[0-9]+/gim));

                if (matchesno > 10) {
                  return msg.edit(embed2.setColor('ORANGE').setDescription(`There are too many matching results. (${matchesno})`)).catch(console.error);
                }

                if (matchesno === 1) {
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

                      getModInfo(embed3, parsedData_, match);

                      msg_.edit(embed3.setColor('BLUE'));
                    });
                  });
                }

                embed.setDescription(`Found ${matchesno} matches.\n`);

                const matches = parsedData.match(/<div class="tile-content">[^]*?<\/div>[^]*?<\/div>[^]*?<\/div>[^]*?<\/div>[^]*?<\/div>[^]*?<\/div>[^]*?<\/div>[^]*?<\/div>[^]*?<\/div>[^]*?<\/div>[^]*?<\/div>[^]*?<\/div>[^]*?<\/div>[^]*?<\/div>[^]*?<\/div>[^]*?<\/div>/gim);

                const collector = msg.createReactionCollector(() => true, { time: 60000 });
                collector.on('collect', (reaction, user) => {
                  try {
                    if (user.bot) return;
                    if (user.id !== message.member.user.id) {
                      return setTimeout(() => reaction.users.remove(user), 100);
                    }
                    //if (reaction.emoji !== )
                  } catch (e) {
                    console.error(e);
                  }
                });
                collector.on('end', (reaction, reason) => {
                  try {

                  } catch (e) {
                    console.error(e);
                  }
                });

                let index = 0;
                matches.forEach(async (match) => {
                  try {
                    index += 1;

                    let idmatch = match;
                    idmatch = String(idmatch.match(/<h3><a[^]*?<\/a><\/h3>/gim)[0]);
                    idmatch = String(idmatch.match(/<a href="https:\/\/www.nexusmods.com\/subnautica\/mods\/[0-9]+">/gim));
                    idmatch = String(idmatch.match(/[0-9]+/gim));

                    let namematch = match;
                    namematch = String(namematch.match(/<h3><a[^]*?<\/a><\/h3>/gim)[0]);
                    namematch = String(namematch.match(/">[^]*?(?=<\/a>)/gim));
                    namematch = namematch.substring(2);

                    let authormatch = match;
                    authormatch = String(authormatch.match(/\/[0-9]+">[^]*?<\/a>/gim)[1]);
                    authormatch = authormatch.replace(/\/[0-9]+">/gim, '');
                    authormatch = authormatch.substring(0, authormatch.length - 4);

                    let emoji;
                    let react;
                    switch (index) {
                      case 1:
                        emoji = ':one:';
                        react = '1⃣';
                        break;
                      case 2:
                        emoji = ':two:';
                        react = '2⃣';
                        break;
                      case 3:
                        emoji = ':three:';
                        react = '3⃣';
                        break;
                      case 4:
                        emoji = ':four:';
                        react = '4⃣';
                        break;
                      case 5:
                        emoji = ':five:';
                        react = '5⃣';
                        break;
                      case 6:
                        emoji = ':six:';
                        react = '6⃣';
                        break;
                      case 7:
                        emoji = ':seven:';
                        react = '7⃣';
                        break;
                      case 8:
                        emoji = ':eight:';
                        react = '8⃣';
                        break;
                      case 9:
                        emoji = ':nine:';
                        react = '9⃣';
                        break;
                      case 10:
                        emoji = ':ten:';
                        react = '🔟';
                        break;
                    }

                    embed.setDescription(`${embed.description}\n${emoji} ${namematch} - ${authormatch} - [${idmatch}](https://nexusmods.com/subnautica/mods/${idmatch})`);

                    // reactions.push({ emoji, react });
                    await msg.react(react).catch(console.error);
                  } catch (e) {
                    console.error(e);
                  }
                });

                await msg.react('❌').catch(console.error);
                msg.edit(embed.setColor('BLUE')).catch(console.error);
              } catch (e) {
                console.error(e);
              }
            });
          } catch (e) {
            console.error(e);
          }
        }).catch(console.error);
      } catch (e) {
        console.error(e);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports.help = {
  name: 'nexus',
  description: 'Retrieves mod information from nexusmods.com',
  usage: '<id>/<name>',
  examples: ['113', 'SMLHelper V2'],
  aliases: null,
  permission: 'user',
  disabled: false,
};

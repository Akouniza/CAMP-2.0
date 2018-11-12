const Discord = require('discord.js');

const emojis = {
  1: {
    emoji: ':one:',
    react: '1⃣',
  },
  2: {
    emoji: ':two:',
    react: '2⃣',
  },
  3: {
    emoji: ':three:',
    react: '3⃣',
  },
  4: {
    emoji: ':four:',
    react: '4⃣',
  },
  5: {
    emoji: ':five:',
    react: '5⃣',
  },
  6: {
    emoji: ':six:',
    react: '6⃣',
  },
  7: {
    emoji: ':seven:',
    react: '7⃣',
  },
  8: {
    emoji: ':eight:',
    react: '8⃣',
  },
  9: {
    emoji: ':nine:',
    react: '9⃣',
  },
  10: {
    emoji: ':keycap_ten:',
    react: '🔟',
  },
  x: {
    emoji: ':x:',
    react: '❌',
  },
};

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

    let uploader = String(parsedData_.match(/users\/[0-9]+?">.*?<\/a>/gim)[0]);
    uploader = uploader.replace(/users\/[0-9]+?">/gim, '');
    uploader = uploader.substring(0, uploader.length - 4);
    embed3.addField('Uploaded by', uploader, true);

    let likes = String(parsedData_.match(/mfp-zoom-in">[0-9,]+(?=<\/a>)/gim));
    likes = likes.replace(/,/gim, '');
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

                const matcharray = new Discord.Collection();

                const collector = msg.createReactionCollector(() => true, { time: 60000 });
                collector.on('collect', async (reaction, user) => {
                  try {
                    if (user.bot && cancelledActions.includes(reaction.message.id)) return setTimeout(() => reaction.users.remove(user), 100);
                    if (cancelledActions.includes(reaction.message.id)) return;
                    if (user.bot) return;
                    if (user.id !== message.member.user.id) return setTimeout(() => reaction.users.remove(user), 100);
                    let index;
                    switch (reaction.emoji.name) {
                      case emojis[1].react:
                        index = 1;
                        break;
                      case emojis[2].react:
                        index = 2;
                        break;
                      case emojis[3].react:
                        index = 3;
                        break;
                      case emojis[4].react:
                        index = 4;
                        break;
                      case emojis[5].react:
                        index = 5;
                        break;
                      case emojis[6].react:
                        index = 6;
                        break;
                      case emojis[7].react:
                        index = 7;
                        break;
                      case emojis[8].react:
                        index = 8;
                        break;
                      case emojis[9].react:
                        index = 9;
                        break;
                      case emojis[10].react:
                        index = 10;
                        break;
                      case emojis.x.react:
                        index = -1;
                    }
                    if (index === -1) {
                      cancelledActions.push(reaction.message.id);
                      // eslint-disable-next-line no-underscore-dangle
                      const embed__ = new Discord.MessageEmbed()
                        .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
                        .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL())
                        .setColor('RED')
                        .setDescription('Cancelled by user.');
                      setTimeout(() => reaction.message.reactions.removeAll(), 100);
                      reaction.message.edit(embed__).catch(console.error);
                      return;
                    }
                    cancelledActions.push(reaction.message.id);
                    const embedX = new Discord.MessageEmbed()
                      .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
                      .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());
                    const embedY = new Discord.MessageEmbed()
                      .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
                      .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL());
                    setTimeout(() => reaction.message.reactions.removeAll(), 100);
                    msg.edit(embedY.setDescription('Loading mod information...')).catch(console.error);
                    const match = matcharray.get(index);
                    if (!match) return msg.edit(embedX.setColor('RED').setDescription('An error occurred.\nIt seems that the mod you chose doesn\'t exist...'));
                    await require('../util/cors.js')({
                      method: 'GET',
                      url: `nexusmods.com/subnautica/mods/${match}`,
                      data: '',
                    }, async (data_) => {
                      if (!data_ || data_ === '') return msg.edit(embedX.setColor('RED').setDescription('Could not get data from NexusMods!')) && client.error(`Could not get data from NexusMods! Mod ID = ${match}`);

                      if (String(data_).includes('The mod you were looking for couldn\'t be found')) return msg.edit(embedX.setColor('ORANGE').setDescription('The mod you were looking for couldn\'t be found.'));

                      // eslint-disable-next-line no-underscore-dangle
                      const parsedData_ = String(data_.replace(/<script[^>]*>[^]*?<\/script>/gim, ''));

                      getModInfo(embedX, parsedData_, match);

                      msg.edit(embedX.setColor('BLUE'));
                    });
                  } catch (e) {
                    console.error(e);
                  }
                });
                collector.on('end', (reaction) => {
                  try {
                    if (reaction.size <= 0) return;
                    if (cancelledActions.includes(reaction.first().message.id)) return;
                    cancelledActions.push(reaction.first().message.id);
                    // eslint-disable-next-line no-underscore-dangle
                    const embed__ = new Discord.MessageEmbed()
                      .setAuthor(bot.nickname ? bot.nickname : bot.user.username, client.user.avatarURL())
                      .setFooter(`${message.member.nickname ? message.member.nickname : message.member.user.username}: ${config.prefix}${command} ${args.join(' ')}`, message.member.user.avatarURL())
                      .setColor('RED')
                      .setDescription('Automatically cancelled after 60 seconds.');
                    setTimeout(() => reaction.message.reactions.removeAll(), 100);
                    reaction.first().message.edit(embed__).catch(console.error);
                  } catch (e) {
                    console.error(e);
                  }
                });

                if (!matches) return msg.edit(embed.setColor('RED').setDescription('Could not get data from NexusMods!')).catch(console.error) && console.error('Could not get data from NexusMods!');

                let index = 0;
                matches.forEach(async (match) => {
                  try {
                    if (cancelledActions.includes(msg.id)) return;

                    index += 1;

                    let idmatch = match;
                    idmatch = String(idmatch.match(/<h3><a[^]*?<\/a><\/h3>/gim)[0]);
                    idmatch = String(idmatch.match(/<a href="https:\/\/www.nexusmods.com\/subnautica\/mods\/[0-9]+">/gim));
                    idmatch = String(idmatch.match(/[0-9]+/gim));

                    matcharray.set(index, idmatch);

                    let namematch = match;
                    namematch = String(namematch.match(/<h3><a[^]*?<\/a><\/h3>/gim)[0]);
                    namematch = String(namematch.match(/">[^]*?(?=<\/a>)/gim));
                    namematch = namematch.substring(2);

                    let authormatch = match;
                    authormatch = String(authormatch.match(/\/[0-9]+">[^]*?<\/a>/gim)[1]);
                    authormatch = authormatch.replace(/\/[0-9]+">/gim, '');
                    authormatch = authormatch.substring(0, authormatch.length - 4);

                    embed.setDescription(`${embed.description.substring(0, embed.description.length - 24)}\n${emojis[index].emoji} ${namematch} - ${authormatch} - [${idmatch}](https://nexusmods.com/subnautica/mods/${idmatch})${matchesno !== index ? '\nLoading more results...' : ''}`);

                    if (cancelledActions.includes(msg.id)) return;
                    await msg.react(emojis[index].react).catch(console.error);

                    if (cancelledActions.includes(msg.id)) return;
                    msg.edit(embed).catch(console.error);
                  } catch (e) {
                    console.error(e);
                  }
                });

                if (cancelledActions.includes(msg.id)) return;

                await msg.react(emojis.x.react).catch(console.error);
                if (cancelledActions.includes(msg.id)) return;
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

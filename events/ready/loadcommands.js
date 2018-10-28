const read = require('fs-readdir-recursive');

module.exports = async (client) => {
  const files = read('./commands/');
  const jsfiles = files.filter(f => f.split('.').pop() === 'js');

  if (jsfiles.length <= 0) return client.warn('There are no commands to load...');

  client.debug(`Loading ${jsfiles.length} commands...`);

  jsfiles.forEach((f) => {
    const props = require(`../../commands/${f}`);
    client.debug(`Loading command '${props.help.name}'...`);
    client.commands.set(props.help.name, props);
  });
};

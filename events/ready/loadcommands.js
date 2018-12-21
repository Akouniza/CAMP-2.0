const read = require('fs-readdir-recursive');

module.exports = async (client) => {
  const files = read('./commands/');
  const jsfiles = files.filter(f => f.split('.').pop() === 'js');

  if (jsfiles.length <= 0) return client.warn('There are no commands to load...');

  // client.debug(`Loading ${jsfiles.length} commands...`);

  jsfiles.forEach((f) => {
    const props = require(`../../commands/${f}`);
    if (props.help.disabled) {
      // client.debug(`Skipped loading of command '${props.help.name}' since it was disabled`);
    } else {
      // eslint-disable-next-line no-unused-vars
      let debug = `Loaded command '${props.help.name}'`;
      client.commands.set(props.help.name, props);
      if (props.help.aliases) {
        debug += ' with aliases ';
        if (Array.isArray(props.help.aliases)) {
          let first = true;
          props.help.aliases.forEach((alias) => {
            if (!first) debug += ', '; else first = false;
            debug += '\'';
            debug += alias;
            debug += '\'';
            client.commands.set(alias, props);
          });
        } else {
          debug += '\'';
          debug += props.help.aliases;
          debug += '\'';
          client.commands.set(props.help.aliases, props);
        }
      }
      // client.debug(debug);
    }
  });
};

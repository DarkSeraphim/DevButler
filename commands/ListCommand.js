const Command = require('../Command');
const {stringSplit} = require('../util.js');
const PREFIX = require('../config.json').prefix || '~';

const SEARCH = ['guild', 'user', 'event']

class ListCommand extends Command {
  constructor (listenerRegistry) {
    super('list');
    this.listenerRegistry = listenerRegistry;
  }

  execute(message, args) {
    args = stringSplit(args, ' ', 2);
    if (args.length < 1 || !SEARCH.includes(args[0]) || (args[0] === 'event' && args.length !== 2)) {
      message.channel.send(`Invalid syntax! Usage: ${PREFIX}list <guild|user|event>`)
      return;
    }

    let prop = args[0];
    let value;
    switch (prop) {
      case 'guild':
        value = (message.guild || {}).id;
        break;
      case 'user':
        value = message.author.id;
        break;
      case 'event':
        value = args[1];
        break;
      default:
        throw 'How did I get here?';
    }

    if (!value) {
      message.channel.send(`You're not in a guild.`);
      return;
    }

    let response = this.listenerRegistry.find(prop, value).map(elem => {
      return `- User with ID ${elem.user} owns a listener for ${elem.even} with ID ${elem.id}`;
    }).join('\n');
    message.channel.send(response);
  }
}

module.exports = ListCommand;

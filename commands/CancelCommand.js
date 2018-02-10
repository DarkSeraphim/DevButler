const Command = require('../Command');
const {stringSplit} = require('../util.js');
const PREFIX = require('../config.json').prefix || '~';

const SEARCH = ['guild', 'user', 'event']

class CancelCommand extends Command {
  constructor (listenerRegistry) {
    super('cancel');
    this.listenerRegistry = listenerRegistry;
  }

  execute(message, args) {
    args = stringSplit(args, ' ', 2);
    if (args.length < 1 || !SEARCH.includes(args[0]) || (args[0] === 'event' && args.length !== 2)) {
      message.channel.send(`Invalid syntax! Usage: ${PREFIX}cancel <guild|user|event>`)
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

    let listeners = this.listenerRegistry.find(prop, value);
    if (!listeners.length) {
      message.channel.send('No listeners found.');
      return;
    }
    listeners.forEach(listener => this.listenerRegistry.remove(listener));
    message.channel.send(`Cancelled ${listeners.length} listeners.`);
  }
}

module.exports = CancelCommand;

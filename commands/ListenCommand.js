const Command = require('../Command');
const {stringSplit} = require('../util.js');
const PREFIX = require('../config.json').prefix || '~';

class ListenCommand extends Command {
  constructor (listenerRegistry) {
    super('listen');
    this.listenerRegistry = listenerRegistry;
  }

  execute (message, args) {
    args = stringSplit(args, ' ', 2);
    if (args.length !== 2) {
      message.channel.send(`Invalid syntax! ${PREFIX}listen <event> <code>`);
      return;
    }

    let event = args[0];
    if (Object.values(Discord.Constants.Event).indexOf(event) === -1) {
      message.channel.send(`Invalid event! Check Discord.js docs for a complete list (or utils/Constants.js)`);
      return;
    }

    let func;
    try {
      func = new vm.Script(args[1]).runInNewContext();
    } catch(e) {
      message.channel.send(`Invalid code submitted!`);
      return;
    }

    let guild = (message.guild || NO_GUILD).id;
    let user = message.author.id; // Extract guild & user

    this.listenerRegistry.add(event, func,  user, guild);
  }
}

module.exports = ListenCommand;

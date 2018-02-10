const vm = require('vm');
const Discord = require('discord.js');

const config = require('./config.json');
const {stringSplit} = require('./util.js');
const COMMAND_MAP = new Map(require('./commands').map(cmd => [cmd.name, cmd]))

const PREFIX = config.prefix || '~';
const NO_GUILD = {id: 'NO_GUILD'}; // Avoid empty string bugs

const client = new Discord.Client();
let id = 0;
let handlers = [];

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', async message => {
  if (message.author.bot) {
    return;
  }
  console.log('Message received:', message.content);
  if (message.content.startsWith(`${PREFIX}`)) {
    let [command, args] = stringSplit(message.content.substring(PREFIX.length), ' ', 2);
    args = args || '';
    var executor = COMMAND_MAP.get(command);
    if (!executor) {
      console.log(COMMAND_MAP);
      message.channel.send(`Unknown command ${command}.`);
      return;
    }
    console.log(args);
    try {
      executor.execute(message, args);
    } catch (e) {
      console.log(`Unexpected error while running command '${command.name}',`, e);
    }
  }
});

client.login(config.token).catch(e => {
  console.log(e);
  process.exit(-1);
});

class Command {
  constructor (name) {
    Object.defineProperty(this, 'name', {value: name});
  }

  get name() {
    return this.name;
  }

  execute(message, args) {
    message.channel.send(`Command '${this.name}' has no handler.`);
  }
}

module.exports = Command;

const Collection = require('Discord').Collection;

class Entry {
  constructor (id, event, func, user, guild) {
    this.id = id;
    this.event = event;
    this.func = func;
    this.user = user;
    this.guild = guild;
  }

  get id() {
    return this.id;
  }

  get event() {
    return this.event;
  }

  get func() {
    return this.func;
  }

  get user() {
    return this.user;
  }

  get guild() {
    return this.guild;
  }
}

class ListenerRegistry {
  constructor (client) {
    this.client = client;
    this.id = 0;
    this.handlers = new Collection();
  }

  add(event, func, user, guild) {
    let myId = ++this.id;
    this.client.on(event, func);
    this.handlers.set(myId, new Entry(myId, event, func, user, guild));
  }

  find(prop, value) {
    return this.handlers.findAll(prop, value);
  }

  remove(entry) {
    this.client.removeListener(entry.event, entry.func);
    this.handlers.delete(event.id);
  }

  removeAll() {
    Array.from(this.handlers.values()).forEach(entry => this.client.removeListener(entry.event, entry.func));
    this.handlers = new Collection();
  }
}

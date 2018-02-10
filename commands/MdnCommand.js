const Command = require('../Command');
const Discord = require('discord.js');
const fetch = require('node-fetch');
const { parseString } = require('xml2js');

const BACKTICKS = '```';
const TAG_DECORATORS = {
  p: value => `\n${value}\n`,
  // Smart guess JavaScript since this is MDN
  code: value => `${BACKTICKS}js\n${value}${BACKTICKS}`,
  b: value => `*${value}*`,
  i: value => `_${value}_`,
  s: value => `~~${value}~~`,
  u: value => `__${value}__`,
};

class MdnCommand extends Command {
  constructor () {
    super('mdn');
  }

  execute(message, args) {
    fetch(`https://api.duckduckgo.com/?q=mdn%20${encodeURIComponent(args)}&format=json&pretty=0`)
      .then(res => res.json())
      .then(async res => {
        const url = res.AbstractURL;
        let summary = res.Abstract;
        if (!url) {
          return message.channel.send('No result found');
        }
        if (!summary) {
          summary = `Here's your search result!`;
        } else {
          summary = await this._parseSummary(summary);
        }
        let embed = new Discord.RichEmbed();
        embed.setAuthor("MDN", "https://www.underconsideration.com/brandnew/archives/mozilla_2017_logo.png")
        embed.setDescription(summary);
        embed.addField("Source", url);
        return message.channel.send(embed);
      }).catch(e => {
        console.log(e);
        message.channel.send('Oops! Seems like my creator did something stupid or an external resource changed!');
      });
  }

  async _parseSummary(summary) {
    let root;
    try {
      root = await this._parseXML(summary);
    } catch (e) {
      console.log('Failed to parse abstract as XML:', e);
      return summary;
    }

    // Parse root:
    // Each <p> gets it's own paragraph
    // Each code block gets codified
    return this._parseHTML(root);
  }

  _getDecorator(key, value) {
    if (value && value.constructor === Array) {
      return $ => $;
    }
    return TAG_DECORATORS[key] || ($ => $); // NO-OP by default
  }

  _parseHTML(tag, parent) {
    if (tag && tag.constructor === String) {
      return tag;
    } else if (tag && tag.constructor === Array) {
      let decorator = this._getDecorator(parent, tag)
      return tag.map(tag => {
          let decorator = this._getDecorator(parent, tag);
          return decorator(this._parseHTML(tag, parent));
        }).join('');
    }
    // Assume it's an object instead
    return Object.entries(tag).filter(([key]) => key !== '$').map(([key, value]) => {
      let decorator = this._getDecorator(key, value);
      return decorator(this._parseHTML(value, key));
    }).join('');
  }

  _parseXML(str) {
    return new Promise((resolve, reject) => {
      parseString(str, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }
}

module.exports = MdnCommand;

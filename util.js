let isString = (str) => str !== undefined && str.constructor === String;
module.exports = {
  isString, 
  stringSplit: (str, needle, index = -1) => {
    if (!isString(str)) {
      throw new Error('str was not a string');
    }
    if (!isString(needle)) {
      throw new Error('needle was not a string');
    }
    if (typeof index !== 'number') {
      throw new Error('index is not a number');
    }

    str = str.slice();
    if (index == 0) {
      return str;
    } else if (index == 1) {
      return [str];
    }
    s = str.split(needle);
    if (index > 0 && index < s.length) {
      s.push(s.splice(index - 1).join(' '));
    }
    return s;
  }
};

"use strict";

class Util {
    constructor(){
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }

    static resolveColor(color) {
    if (typeof color === 'string') {
      if (color === 'RANDOM') return Math.floor(Math.random() * (0xffffff + 1));
      if (color === 'DEFAULT') return 0;
      color = Colors[color] || parseInt(color.replace('#', ''), 16);
    } else if (Array.isArray(color)) {
      color = (color[0] << 16) + (color[1] << 8) + color[2];
    }

    if (color < 0 || color > 0xffffff) throw new RangeError('Color value out of range');
    else if (color && isNaN(color)) throw new TypeError('cannot convert color');

    return color;
  }
}

module.exports = Util;
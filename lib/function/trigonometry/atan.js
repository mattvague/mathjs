'use strict';

var bigArcTan = require('../../util/bignumber').arctan_arccot;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));
  var complexLog = load(require('../arithmetic/log')).signatures['Complex'];

  /**
   * Calculate the inverse tangent of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.atan(x)
   *
   * Examples:
   *
   *    math.atan(0.5);           // returns Number 0.4636476090008061
   *    math.atan(math.tan(1.5)); // returns Number 1.5
   *
   *    math.atan(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    tan, asin, acos
   *
   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x   Function input
   * @return {Number | BigNumber | Complex | Array | Matrix} The arc tangent of x
   */
  var atan = typed('atan', {
    'number': function (x) {
      return Math.atan(x);
    },

    'Complex': function (x) {
      if (x.re == 0) {
        if (x.im == 1) {
          return new type.Complex(0, Infinity);
        }
        if (x.im == -1) {
          return new type.Complex(0, -Infinity);
        }
      }

      // atan(z) = 1/2 * i * (ln(1-iz) - ln(1+iz))
      var re = x.re;
      var im = x.im;
      var den = re * re + (1.0 - im) * (1.0 - im);

      var temp1 = new type.Complex(
          (1.0 - im * im - re * re) / den,
          (-2.0 * re) / den
      );
      var temp2 = complexLog(temp1);

      return new type.Complex(
          -0.5 * temp2.im,
          0.5 * temp2.re
      );
    },

    'BigNumber': function (x) {
      return bigArcTan(x, type.BigNumber, false);
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since atan(0) = 0
      return collection.deepMap(x, atan, true);
    }
  });

  return atan;
}

exports.name = 'atan';
exports.factory = factory;
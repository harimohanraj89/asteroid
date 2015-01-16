var Util = {};

// Underscore's `extend`
// Underscore.js 1.7.0
// http://underscorejs.org
// (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
// Underscore may be freely distributed under the MIT license.

Util.extend = function(obj) {
  if (!(typeof obj === "object")) return obj;
  var source, prop;
  for (var i = 1, length = arguments.length; i < length; i++) {
    source = arguments[i];
    for (prop in source) {
      if (hasOwnProperty.call(source, prop)) {
          obj[prop] = source[prop];
      }
    }
  }
  return obj;
};

Util.includeBehavior = function(constructor, mod) {
  if (constructor.prototype) {
    Util.extend(constructor.prototype, (mod.behaviors || {}));
  }
};

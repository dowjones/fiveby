var util = require('util'),
  EventEmitter = require('events').EventEmitter;

/**
 * Expose `Map`.
 */

exports = module.exports = Map;

/**
 * Map
 *
 * An an object that maps keys to values.
 * A map cannot contain duplicate keys; each key can map to at most one value.
 *
 * Look at [java.util.Map](http://docs.oracle.com/javase/6/docs/api/java/util/Map.html)
 *
 * @param {Object} object the keys & values of which will be the keys/values of this map
 *
 */

function Map(object) {
  this._map = {};
  this._mapSize = 0;
  if (object) {
    this._putObject(object);
  }
}
util.inherits(Map, EventEmitter);

/**
 * Removes all entries from the map.
 * emits the 'clear' event
 */

Map.prototype.clear = function () {
  this._map = {};
  this._mapSize = 0;
  this.emit('clear');
};

/**
 * Returns true if this map contains a
 * mapping for the specified key.
 *
 * @param {String} key
 * @return {Boolean}
 */

Map.prototype.containsKey = function (key) {
  if (!this._isValid(key)) return false;
  return !!(this._map[key]);
};

/**
 * Returns true if this map contains one or more
 * keys for the specified value
 *
 * @param {Object} value
 * @return {Boolean}
 */

Map.prototype.containsValue = function (value) {
  if (!this._isValid(value)) return false;
  var map = this._map,
    hasEquals = ('function' === typeof value.equals);
  for (var key in map) {
    if (hasOwnProperty.call(map, key)) {
      if (hasEquals ?
        value.equals(map[key]) :
        value === map[key]) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Returns an array of the key/value pairs contained in this map.
 *
 * @return {Array} [{key: String, value: Object}]
 */

Map.prototype.entrySet = function () {
  var map = this._map,
    set = [];
  for (var key in map) {
    if (hasOwnProperty.call(map, key)) {
      set.push({
        key: key,
        value: map[key]
      });
    }
  }
  return set;
};

/**
 * Determines whether the keys and values
 * of the current map are equal to the one provided.
 *
 * @param {Map} otherMap to compare
 * @return {Boolean}
 */

Map.prototype.equals = function (otherMap) {
  if (!this._isValid(otherMap) || (!(otherMap instanceof Map)) || (otherMap.size() !== this.size())) {
    return false;
  }
  var map = this._map;
  for (var key in map) {
    if (hasOwnProperty.call(map, key)) {
      if (!otherMap.containsKey(key) || !otherMap.containsValue(map[key])) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Get the value from the map with the provided key.
 *
 * @param {String} key
 * @return {Object} value or null if one isn't found
 */

Map.prototype.get = function (key) {
  if (!this._isValid(key)) throw new Error('invalid key');
  var value = this._map[key];
  return ('undefined' !== typeof value ? value : null);
};

/**
 * Put the value from the map with the provided key.
 *
 * Emits the 'put' event with the key, value as params.
 *
 * @param {String} key
 * @param {Object} value
 */

Map.prototype.put = function (key, value) {
  if (!this._isValid(key)) throw new Error('invalid key');
  this._map[key] = value;
  this._mapSize++;
  this.emit('put', key, value);
};

/**
 * Put each key/value of the provided map into the current one.
 *
 * Emits the 'put' event on every inserted key.
 *
 * @param {Map} map
 */

Map.prototype.putAll = function (map) {
  if (!this._isValid(map) || !(map instanceof Map)) {
    throw new Error('invalid map');
  }
  var self = this;
  map.keySet().forEach(function (key) {
    self.put(key, map.get(key));
  });
};

/**
 * Remove a mapping with the provided key.
 *
 * Emits the 'remove' event with the key, oldValue as params.
 *
 * @param {String} key
 * @return {Object} old value
 */

Map.prototype.remove = function (key) {
  if (!this._isValid(key)) throw new Error('invalid key');
  var oldValue = this._map[key];
  delete this._map[key];
  this._mapSize--;
  this.emit('remove', key, oldValue);
  return oldValue;
};

/**
 * Determines whether the map has any mappings.
 *
 * @return {Boolean}
 */

Map.prototype.isEmpty = function () {
  return (this._mapSize === 0);
};

/**
 * Get a set of all keys of this map
 *
 * @return {Array}
 */

Map.prototype.keySet = function () {
  return Object.keys(this._map);
};

/**
 * @return {Number} size
 */

Map.prototype.size = function () {
  return this._mapSize;
};

/**
 * Get a set of all values of this map
 *
 * @return {Array}
 */

Map.prototype.values = function () {
  var map = this._map
    , values = [];
  for (var key in map) {
    if (hasOwnProperty.call(map, key)) {
      values.push(map[key]);
    }
  }
  return values;
};

/**
 * Object is considered valid if
 * it is defined and not null
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

Map.prototype._isValid = function (obj) {
  return (('undefined' !== typeof obj) && (null !== obj));
};

/**
 * Add all keys / values of the provided object
 * into the current map.
 *
 * @param {Object} obj the keys & values of \
 *   which will be the keys/values of this map
 * @api private
 */

Map.prototype._putObject = function (obj) {
  if ('object' !== typeof obj) throw new Error('invalid object');
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      this._map[key] = obj[key];
      this._mapSize++;
    }
  }
};

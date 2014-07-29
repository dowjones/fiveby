var MapUtil = require('./map');
var Cache = require('./cache');

/**
 * Expose service
 */

module.exports = PropertyService;

/**
 * Property Service
 *
 * The purpose of this service is to provide a place
 * to store environment-specific configuration.
 *
 * Usage:
 *     // $inject: ['core.PropertyService']
 *
 *     properties = propertyService.getProperties('my.namespace')
 *
 *     properties.setMany({
 *       serviceVersion: {
 *           'development,staging': '1.0.0'
 *         , 'production': '2.0.0'
 *         , 'production.dc1': '3.0.0'
 *         , 'production.*.az1': '4.0.0'
 *       }
 *     })
 *
 *     // NODE_ENV = 'staging'  or  NODE_ENV = 'development'
 *     properties.get('serviceVersion') // 1.0.0
 *
 *     // NODE_ENV = 'production.dc1'
 *     properties.get('serviceVersion') // 3.0.0
 *
 *     // NODE_ENV = 'production.dc2'
 *     properties.get('serviceVersion') // 2.0.0
 *
 *     // NODE_ENV = 'production.dc1.az1'
 *     properties.get('serviceVersion') // 4.0.0
 */

function PropertyService(environment) {
  this._env2rank = this._calculateRanks(environment);
  this._coreKey2rank = {};
  var cacheSvc = new Cache();
  this._cache = cacheSvc.getCache('core.PropertyService');
}

PropertyService.prototype.getProperties = function (namespace) {
  var key2rank = this._coreKey2rank;
  var cache = this._cache;

  return new Properties(this._env2rank, namespace, key2rank, cache);
};

function Properties(env2rank, namespace, key2rank, cache) {
  this._env2rank = env2rank;
  this.namespace = namespace;
  this._key2rank = key2rank;
  this._cache = cache;
}

/**
 * Set a property.
 *
 * @param {String} env environment
 * @param {String} key
 * @param {String|Number|Boolean|Object} value
 */

Properties.prototype.set = function (env, key, value) {
  var rank = this._env2rank[env.trim()];

  // don't set any keys for other environments
  if ('undefined' === typeof rank) return;

  var propKey = (this.namespace + ':' + key),
    highest = (this._key2rank[propKey] || -1);

  if (rank < highest) return;
  this._key2rank[propKey] = rank;

  this._cache.put(propKey, value);
};

/**
 * Set many properties at once.
 *
 * Example:
 *
 *     this.properties.setMany({
 *         transport: 'Console'
 *       , filename: {
 *             'test,development,local': undefined
 *           , 'fdev,sat,prod': '/var/log/tesla'
 *         }
 *       , level: {
 *             'test': 'error'
 *           , 'development,local': undefined
 *           , 'fdev': 'warn'
 *           , 'sat,prod': 'error'
 *         }
 *     });
 *
 * @param {Object} properties
 */

Properties.prototype.setMany = function (properties) {
  var trimRegExp = this._trimRegExp,
    hasOwn = Object.hasOwnProperty;

  for (var name in properties) {
    if (!hasOwn.call(properties, name)) continue;
    var property = properties[name];

    if ('object' !== typeof property ||
      Array.isArray(property)) {
      this.set('all', name, property);
      continue;
    }

    for (var envNames in property) {
      if (!hasOwn.call(property, envNames)) continue;
      var value = property[envNames],
        envs = envNames.split(',');

      for (var i = 0, l = envs.length; i < l; i++) {
        this.set(envs[i], name, value);
      }
    }
  }
};

/**
 * Retrieve a property.
 *
 * @param {String} key
 * @param {String|Number|Boolean|Object} defaultValue (optional)
 */

Properties.prototype.get = function (key, defaultValue) {
  var propKey = (this.namespace + ':' + key),
    prop = this._cache.get(propKey);
  return ((null === prop) && ('undefined' !== typeof defaultValue)) ? defaultValue : prop;
};

/**
 * Pre-calculate the environments to allow environment segments
 * and set-up rank to establish their precedence.
 */

PropertyService.prototype._calculateRanks = function (environment) {
  var env2rank = {},
    segments = environment.split('.'),
    weight = 1;

  function modify(key) {
    var r = env2rank[key];
    if (r > 0 && r < weight / 2) {
      var s = key;
      while (r < weight / 2) {
        s += '.*';
        r *= 2;
      }
      env2rank[s + '.' + segments[i]] = weight + r;
    } else {
      env2rank[key + '.' + segments[i]] = weight + r;
      env2rank[key + segments[i]] = weight + r;
    }
  }

  for (var i = 0, l = segments.length; i < l; i++) {
    Object.keys(env2rank).forEach(modify);

    if (i === 0) env2rank[segments[i]] = weight;
    weight *= 2; //higher than all previous combinations
  }

  env2rank.all = 0;
  return env2rank;
};

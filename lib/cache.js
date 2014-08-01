var Cache = require('tesla.lib.cache').RamLru;

/**
 * Expose service.
 */

module.exports = CacheService;

function CacheService() {
  this._caches = new Cache();
}

CacheService.prototype.getCache = function (name, options) {
  function store() {
    return new Cache(options);
  }
  return this._caches.readThrough(name, store);
};

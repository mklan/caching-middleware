const redis = require('redis');

let cache;

/**
 * Factory method for creating a new cache.
 * @returns {{init: init, client: {}}}
 */
function createCache({ host, port }) {

    if(cache) return cache;


    const client = redis.createClient({ host, port });

    /**
     * Writes a key:value pair into redis.
     * @param {String} key
     * @param {Any} value
     */
    const set = (key, value) => client.set(key, value);

    /**
     * Writes a key:value pair into redis which expires after given time.
     * @param {String} key
     * @param {Any} value
     * @param {Int} exp
     */
    const setex = (key, value, exp) => client.setex(key, exp, value);

    /**
     * Retrieves a value by key from redis.
     * @param {String} key
     */
    const get = async (key) =>
      new Promise((resolve, reject) => {
        client.get(key, (err, res) =>
          err ? reject(err) : resolve(res));
      });

    /**
     * Removes a entry by given key.
     * @param {String} key
     */
    const remove = (key) => client.del(key);

    /**
     * Saves a whole object to an according key.
     * @param {String} key
     * @param {Object} obj
     */
    const setObj = (key, obj) => client.hmset(key, obj);

    /**
     * Saves a whole object to an according key, which will be deleted after given time.
     * @param {String} key
     * @param {Object} obj
     * @param {Int} exp
     */
    const setObjEx = (key, obj, exp) =>
      client.hmset(key, obj, (err) => !err && client.expire(key, exp));

    /**
     * Retrieves a object value by key from redis.
     * @param key
     */
    const getObj = async (key) =>
      new Promise((resolve, reject) => {
        client.hgetall(key, (err, res) =>
          err ? reject(err) : resolve(res));
      });


    cache = { client, client, set, setex, get, remove, setObj, getObj, setObjEx };

    return cache;
}

module.exports = createCache;

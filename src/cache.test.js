/**
 * @cache.test.js
 * Cache Service Tests
 */

const createCache = require('./cache-service');
const { find, findAndUpdate } = require('./utils');

const wait = ms => new Promise(res => setTimeout(res, ms));

const port = 6379;
const host = 'localhost';

describe('cache', async () => {

  let cache

  beforeEach(() => {
    cache = createCache({ host, port });
  });

  it('init creates a client with given host and port', async () => {
    const options = cache.client.connection_options;

    expect(options.host).toEqual(host);
    expect(options.port).toEqual(port);

  });

  it('exposes the set method', async () => {
    expect(cache.set).toBeDefined();
  });

  it('exposes the setex method', async () => {
    expect(cache.setex).toBeDefined();
  });


  it('exposes the get method', async () => {
    expect(cache.get).toBeDefined();
  });

  it('exposes the setObj method', async () => {
    expect(cache.setObj).toBeDefined();
  });

  it('exposes the getObj method', async () => {
    expect(cache.getObj).toBeDefined();
  });

  it('exposes the remove method', async () => {
    expect(cache.remove).toBeDefined();
  });

  it('set() is able to set an value which is retrievable by get()', async () => {
    const key = 'foo';
    const value = 'bar';

    cache.set(key, value);
    const result = await cache.get(key);
    expect(result).toEqual(value);
  });

  it('setObj() is able to set an value which is retrievable by getObj()', async () => {

    const key = 'obj';
    const value = { value: 'bar' };

    cache.setObj(key, value);
    const result = await cache.getObj(key);
    expect(result).toEqual(value);
  });

  it('getObj is able to retrieve a value set by setObjEx() within expiration time', async () => {

    const key = 'foo';
    const value = { value: 'bar' };

    cache.remove(key);

    cache.setObjEx(key, value, 5);
    const result = await cache.getObj(key);
    expect(result).toEqual(value);
  });


  it('get() is NOT able to retrieve a value set by setObjEx() after expiration time', async () => {

    const key = 'foo';
    const value = { value: 'bar' };

    cache.remove(key);
    cache.setObjEx(key, value, 1);

    await wait(1100);

    const result = await cache.getObj(key);
    expect(result).toBeNull();
  });

  it('get is able to retrieve a value set by setex() within expiration time', async () => {

    const key = 'foo';
    const value = 'bar';

    cache.setex(key, value, 5);
    const result = await cache.get(key);
    expect(result).toEqual(value);
  });

  it('get() is NOT able to retrieve a value set by setex() after expiration time', async () => {

    const key = 'foo';
    const value = 'bar';

    cache.setex(key, value, 1);

    await wait(1100);

    const result = await cache.get(key);
    expect(result).toBeNull();
  });

  it('get will result in null for not known key', async () => {

    const key = 'missing';

    const result = await cache.get(key);
    expect(result).toBeNull();
  });

  it('get() is NOT able to retrieve a value after removal', async () => {

    const key = 'foo';
    const value = 'bar';

    cache.set(key, value);

    cache.remove(key);

    const result = await cache.get(key);

    expect(result).toBeNull();
  });


  it('find() will prefer cache', async () => {

    const key = 'foo';
    const cacheValue = 'cache';

    cache.set(key, cacheValue);

    const primary = (key) => cache.get(key);

    const { result } = await find('foo', { primary, fallback: () => {}});

    expect(result).toEqual(cacheValue);
  });


  it('find() will use fallback if not found in cache', async () => {

    const key = 'foo';
    const mockDatabase = { [key]: 'fallback' };

    cache.remove(key);

    const primary = (key) => cache.get(key);
    const fallback = (key) => mockDatabase[key];

    const { result } = await find(key, { primary, fallback });

    expect(result).toEqual(mockDatabase[key]);
  });

  it('findAndUpdate() will use fallback if not found in cache', async () => {

    const key = 'foo';
    const mockDatabase = { [key]: 'fallback' };

    cache.remove(key);

    const primary = (key) => cache.get(key);
    const fallback = (key) => mockDatabase[key];
    const update = cache.set;

    const { result } = await findAndUpdate(key, { primary, fallback, update });

    expect(result).toEqual(mockDatabase[key]);
  });


  it('findAndUpdate() will update cache with data from db if not found', async () => {

    const key = 'foo';
    const mockDatabase = { [key]: 'fromDB' };

    cache.remove(key);

    const primary = (key) => cache.get(key);
    const fallback = (key) => mockDatabase[key];
    const update = cache.set;

    await findAndUpdate(key, { primary, fallback, update });

    const result = await primary(key);

    expect(result).toEqual(mockDatabase[key]);
  });


});

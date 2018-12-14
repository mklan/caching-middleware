# caching-middleware
redis cache middleware for expressesk backends

## Install

`npm install caching-middleware --save`

## Usage

This middleware will try to retrieve data via a defined `primary` method. You can optionally use the provided redis cache wrapper, or you can hook into your existing caching logic.
If no entry was found, it will try to use a `fallback` method ( here you can target your database ). If the `fallback` method returns a value, the `update`
method will be executed, where you can ideally refresh your cache. On the next request it would retrieve the data using the primary method.


```javascript
  const { createCache, createCacheMiddleware } = require('caching-middleware');
  
  const host = 'localhost';
  const port = 6379;
  
  // wrapper for redis cache
  const cache = createCache({ host, port });
  
  const cacheMiddleware = createCacheMiddleware({
    // looks for a unique key in req.tokenContent.userId
    keyPath: ['tokenContent', 'userId'],
    // method to retrieve data using the defined key
    primary: userId => cache.getObj(userId),
    // method to run, if the no entry is found yet in the primary method (the cache)
    // ideally you want to query your database at this point
    fallback: userId => User.findOneById(userId),
    // method to update the cache, if the data is only available in the fallback strategy
    update: (userId, user) => cache.setObj(userId, user),
  });
  
  app.use(cacheMiddleware);
  
```

the result is finally injected into `req.cacheResult`

## Usecase

You can for example retrieve further information about the requester, without targeting the database on each
request.

## Tests

`npm run test`

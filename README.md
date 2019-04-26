# caching-middleware
caching middleware for expressesk backends

## Install

`npm install caching-middleware --save`

See [migration](https://github.com/mklan/caching-middleware/wiki/Migration-Guide-1.00----2.00) guide due to breaking changes from v1 to v2

## Usage

This middleware will try to retrieve data via a defined `primary` method.
If no entry was found, it will try to use a `fallback` method (here you can query against your database). If the `fallback` method returns a value, the `update`
method will be executed, where you can ideally rehydrate your cache. On the next request the data would be retrieved the from the primary method.


```javascript
  const cache = require('caching-middleware');
  //const db = ...
  //const memCache = ...
  
  const app = express();

  const withUser = cache({
      context: req => ({ userId: req.params.id }),
      resultKey: 'user',
      primary: ctx => memCache.get(ctx.userId),
      fallback: ctx => db.user.findById(ctx.userId),
      // rehydrate cache
      update: (result, ctx) => memCache.set(ctx.userId, result),
    });

    app.get('/user/:id', withUser, (req, res) => {
      res.send(req.user); // req[resultKey]
    });
  
```

## Usecase

You can for example retrieve further information about the requester (user), without targeting the database on each
request all over again. 

## Example App

```
cd example
npm install
./run.sh or npm start
```

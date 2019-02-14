import express from 'express';
import cache from '../src';
import createStore from './store';

const mockCache = createStore();
const mockDb = createStore({
  1: { id: 1, name: 'paul', origin: 'db' },
  2: { id: 2, name: 'zeterick', origin: 'db' },
});

const app = express();

const withUser = cache({
  // context will be passed into primary, fallback and update
  context: req => ({ userId: req.params.id }), //req.tokenObj.userId
  // method to retrieve data using the defined key
  primary: ctx => mockCache.get(ctx.userId),
  // look for 
  fallback: ctx => mockDb.get(ctx.userId),
  // rehydrate cache
  update: (result, ctx) => mockCache.set(ctx.userId, { ...result, origin: 'cache' }),
  resultKey: 'user',
});

app.get('/user/:id', withUser, (req, res) => {
  res.send(req.user);
});

app.listen(3000, () => {
  console.log('listening on port 3000!');
});
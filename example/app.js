import express from 'express';
import cache from '../lib';
import createStore from './store';

const mockCache = createStore();
const mockDb = createStore({
  1: { id: 1, name: 'paul', origin: 'db' },
  2: { id: 2, name: 'zeterick', origin: 'db' },
});

const app = express();

const withUser = cache({
  resultKey: 'user',
  context: req => ({ userId: req.params.id }),
  primary: ctx => mockCache.get(ctx.userId),
  fallback: ctx => mockDb.get(ctx.userId),
  // rehydrate cache
  update: (result, ctx) => mockCache.set(ctx.userId, { ...result, origin: 'cache' }),
});

app.get('/user/:id', withUser, (req, res) => {
  res.send(req.user);
});

app.listen(3000, () => {
  console.log('listening on port 3000!');
});
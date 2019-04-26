const { findAndUpdate } = require('./utils');

const cache = ({ primary, fallback, update, resultKey = 'cacheResult', context = () => {} }) => async (req, res, next) => {
    if(!primary) throw new Error('primary callback not defined');
    if(!fallback) throw new Error('fallback callback not defined');
    const ctx = await context(req);
    const { result } = await findAndUpdate(ctx, { primary, fallback, update });
    req[resultKey] = result;
    next();
}

module.exports = cache;

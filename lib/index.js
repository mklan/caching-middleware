const findAndUpdate = require('./utils');

const cache = ({ primary, fallback, update, resultKey = 'cacheResult', context }) => async (req, res, next) => {
    const ctx = await context(req);
    const { result } = await findAndUpdate(ctx, { primary, fallback, update });
    req[resultKey] = result;
    next();
}

module.exports = cache;

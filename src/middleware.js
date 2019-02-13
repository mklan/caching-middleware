const { findAndUpdate } = require('./utils');


// get deep nested variable value of object
const get = (p, o) =>
  p.reduce((xs, x) =>
    (xs && xs[x]) ? xs[x] : null, o);


const cache = ({ keyPath, primary, fallback, update }) => async (req, res, next) => {
    const key = get(keyPath, req);
    const { result } = await findAndUpdate(key, { primary, fallback, update });
    req.cacheResult = result;
    next();
}

module.exports = cache;

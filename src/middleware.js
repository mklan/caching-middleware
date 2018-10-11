const { findAndUpdate } = require('./utils');


// get deep nested variable value of object
const get = (p, o) =>
  p.reduce((xs, x) =>
    (xs && xs[x]) ? xs[x] : null, o);



const createCacheMiddleware = ({ keyPath, primary, fallback, update }) => {

  const cacheMiddleware = async (req, res, next) => {
    const key = get(keyPath, req);
    const { result } = await findAndUpdate(key, { primary, fallback, update });
    req.cacheResult = result;
    next();
  }

  return cacheMiddleware;
}

module.exports = createCacheMiddleware;

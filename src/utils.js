const ORIGIN = {
  PRIMARY: 0,
  FALLBACK: 1,
};

const find = async (key, {primary, fallback}) => {
  let result = await primary(key);
  if(result) return { result, origin: ORIGIN.PRIMARY };
  result = await fallback(key);
  return { result, origin: ORIGIN.FALLBACK };
};


const findAndUpdate = async (key, {primary, fallback, update}) => {
  const {result, origin } = await find(key, {primary, fallback});

  if (origin !== ORIGIN.PRIMARY && result) {
    update(key, result);
  }

  return { result, origin };
};


module.exports = {
  find,
  findAndUpdate
};

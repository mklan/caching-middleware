const ORIGIN = {
  PRIMARY: 'primary',
  FALLBACK: 'fallback',
};

const find = async (context, {primary, fallback}) => {
  let result = await primary(context);
  if(result) return { result, origin: ORIGIN.PRIMARY };
  result = await fallback(context);
  return { result, origin: ORIGIN.FALLBACK };
};


const findAndUpdate = async (context = {}, {primary, fallback, update = () => {}}) => {
  const {result, origin } = await find(context, {primary, fallback});

  if (result && origin === ORIGIN.FALLBACK) {
    update(result, context);
  }

  return { result, origin };
}

module.exports = {
  findAndUpdate,
  find,
};

const createStore = (initial = {}) => {

  let entries = initial;

  return {
    get: key => entries[key],
    set: (key, value) => {
      entries = {...entries, [key]: value};
      console.log(entries);
      return entries;
    }
  }
};

export default createStore;

// tslint:disable no-magic-numbers

const isObjectConstant = (toTest: object): boolean => {
  let nullProto = false;
  let frozen = false;
  let constDescendents = true;

  const toTestProto = Object.getPrototypeOf(toTest);
  // and a constant object has a null/unmodifiable prototype property...
  if (toTestProto === null && typeof toTestProto === 'object') {
    nullProto = true;
  }
  // and a constant object also is frozen with Object.freeze
  if (Object.isFrozen(toTest)) {
    frozen = true;
  }

  Object.values(toTest).forEach((value) => {
    if (typeof value === 'object') {
      // an object is only const if it is unmodifiable *and*
      // if *all* of its children are also unmodifiable
      if (!isObjectConstant(value as object)) {
        constDescendents = false;
      }
    }
  });

  return nullProto && frozen && constDescendents;
};

export default isObjectConstant;

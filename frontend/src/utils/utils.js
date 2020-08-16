export const ArrayEqual = (array1, array2) => {
  return JSON.stringify(array1) === JSON.stringify(array2);
};

export const Capitalize = string => {
  let capitalized = string.split('');
  capitalized[0] = capitalized[0].toUpperCase();
  return capitalized.join('');
};

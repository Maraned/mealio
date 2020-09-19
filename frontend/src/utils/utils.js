export const ArrayEqual = (array1, array2) => {
  return JSON.stringify(array1) === JSON.stringify(array2);
};

export const Capitalize = string => {
  let capitalized = string.split('');
  capitalized[0] = capitalized[0].toUpperCase();
  return capitalized.join('');
};

export const GetRecipeNameFromDraftEditorContent = content => {
  try {
    return JSON.parse(content).blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
  } catch (err) {
    console.error('GetRecipeNameFromDraftEditorContent', err);
    return content;
  }
};

export const ShowResponseErrorToast = (t, toastDispatch, response, defaultErrorMessage) => {
  const errorMessage = response?.error?.message || defaultErrorMessage;
  toastDispatch({ type: 'add', value: {
    text: t(errorMessage),
    type: 'error',
  }});
};

export const ShowSuccessToast = (t, toastDispatch, successMessage) => {
  toastDispatch({ type: 'add', value: {
    text: t(successMessage),
    type: 'success'
  }});
};

export const TransformRecipeNameToUrl = name => {
  if (!name) {
    return name;
  }
  if (typeof name !== 'string'){
    name = GetRecipeNameFromDraftEditorContent(name);
  }
  const transformedName = name
    .toLowerCase()
    .replace(/å|ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/\s/g, '-');
  return transformedName;
}

export const isEmpty = obj => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

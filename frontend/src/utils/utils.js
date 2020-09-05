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
}

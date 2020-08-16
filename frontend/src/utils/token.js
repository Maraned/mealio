export const setTokens = tokens => {
  const {
    accessToken, 
    refreshToken, 
    currentUserValue,
  } = tokens;

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('currentUserValue', currentUserValue);
}

export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('currentUserValue');
}

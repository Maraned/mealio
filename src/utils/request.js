const url = process.env.BACKEND_URL;

export const login = ({ username, password }) => {
  fetch(`${url}/login`)
    .then(res => res.json())
    .then(res => {
      localStorage.setItem(res.token);
      localStorage.setItem(res.refreshToken);
    })
}

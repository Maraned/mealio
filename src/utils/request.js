import request from 'request-promise-native';
var host = window.location.hostname;
const url = `https://${host}/api`

export const imageUrl = image => {
  if (typeof image !== 'string') {
    return image;
  }

  if (image.includes('data:image')) {
    return image;
  }

  return image.includes('://') ? image : `${url}/images/${image}`;
}

export const postRequest = async (endpoint, data, expectResponse = true) => {
  try {
    const response = await request({
      url: `${url}/${endpoint}`,
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: data,
      json: true,
    });
    if (expectResponse && response.status !== 401) { 
      try {
        return response;
      } catch (error) {
        console.error(error, response);
      }
    } else {
      return response.status;
    }
  } catch (err) {
    console.error('POST ERROR', err);
    throw { error: err.error.error, status: err.statusCode };
  }
};

export const putRequest = async (endpoint, data, expectResponse = false) => {
  const response = await request({
    url: `${url}/${endpoint}`,
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: data,
    json: true,
  });
  if (expectResponse && response.status !== 401) { 
    return response;
  } else {
    return response.status;
  }
};

export const deleteRequest = async (endpoint, data, expectResponse = false) => {
  const response = await request({
    url: `${url}/${endpoint}`,
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: data,
    json: true,
  });

  if (expectResponse && response.status !== 401) { 
    const responseJSON = await response.json();
    return responseJSON;
  } else {
    return response.status;
  } 
};

export const getRequest = async (endpoint, query) => {
  try {
    const response = JSON.parse(await request({
      uri: `${url}/${endpoint}`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
      },
      qs: query,
    }));
    return response;
  } catch (error) {
    console.error('getRequest', { endpoint }, error);
    throw { error: 'Something went wrong with getRequests' };
  }
}

export const login = async ({ username, password }) => {
  const response = JSON.parse(await request({
    uri: `${url}/login` 
  }));
  localStorage.setItem(response.token);
  localStorage.setItem(response.refreshToken);
}

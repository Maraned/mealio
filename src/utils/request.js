import request from 'request-promise-native';
const url = 'http://localhost:3001';

export const postRequest = async (endpoint, data, expectResponse = true) => {
  console.log('sending POST', data, 'to endpoint', endpoint)
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
    console.log('response', response)
    if (expectResponse && response.status !== 401) { 
      try {
        console.log(`POST response ${endpoint}: `, response);
        return response;
      } catch (error) {
        console.error(error, response);
      }
    } else {
      return response.status;
    }
  } catch (err) {
    console.error('POST ERROR', err);
    return { error: err.error.error, status: err.statusCode };
  }
};

export const putRequest = async (endpoint, data, expectResponse = false) => {
  console.log('sending PUT ', data, 'to endpoint', endpoint)
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
    console.log(`PUT response ${endpoint}: `, response);
    return response;
  } else {
    return response.status;
  }
};

export const deleteRequest = async (endpoint, data, expectResponse = false) => {
  console.log('sending DELETE ', data, 'to endpoint', endpoint)
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
    console.log(`DELETE response ${endpoint}: `, responseJSON);
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
    console.log(`GET response ${endpoint}: `, response);
    return response;
  } catch (error) {
    console.error('getRequest', { endpoint });
    return { error: 'Something went wrong with getRequests' };
  }
}

export const login = async ({ username, password }) => {
  const response = JSON.parse(await request({
    uri: `${url}/login` 
  }));
  localStorage.setItem(response.token);
  localStorage.setItem(response.refreshToken);
}

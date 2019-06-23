const url = 'http://localhost:3001';

export const postRequest = async (endpoint, data, expectResponse = true) => {
  console.log('sending ', data, 'to endpoint', endpoint)
  const response = await fetch(`${url}/${endpoint}`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify(data),
  });
  if (expectResponse && response.status !== 401) { 
    try {
      const responseJSON = await response.json();
      console.log(`POST response ${endpoint}: `, responseJSON);
      return responseJSON;
    } catch (error) {
      console.error(error, response);
    }
    
  } else {
    return response.status;
  }
};

export const putRequest = async (endpoint, data, expectResponse = false) => {
  console.log('sending PUT ', data, 'to endpoint', endpoint)
  const response = await fetch(`${url}/${endpoint}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify(data),
  });
  if (expectResponse && response.status !== 401) { 
    const responseJSON = await response.json();
    console.log(`PUT response ${endpoint}: `, responseJSON);
    return responseJSON;
  } else {
    return response.status;
  }
};

export const deleteRequest = async (endpoint, data, expectResponse = false) => {
  console.log('sending DELETE ', data, 'to endpoint', endpoint)
  const response = await fetch(`${url}/${endpoint}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify(data),
  });
  if (expectResponse && response.status !== 401) { 
    const responseJSON = await response.json();
    console.log(`DELETE response ${endpoint}: `, responseJSON);
    return responseJSON;
  } else {
    return response.status;
  } 
};

export const getRequest = async endpoint => {
  const response = await fetch(`${url}/${endpoint}`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
    },
  });
  const responseJSON = await response.json();
  console.log(`GET response ${endpoint}: `, responseJSON);
  return responseJSON;
}

export const login = ({ username, password }) => {
  fetch(`${url}/login`)
    .then(res => res.json())
    .then(res => {
      localStorage.setItem(res.token);
      localStorage.setItem(res.refreshToken);
    })
}

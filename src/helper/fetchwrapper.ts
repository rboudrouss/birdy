import userService from "./userService";

export const fetchWrapper = {
  get,
  post,
  put,
  delete: _delete,
};

export async function get(url: string) {
  const requestOptions = {
    method: "GET",
  };
  const response = await fetch(url, requestOptions);
  return handleResponse(response);
}

async function post(url: string, body: any) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  const response = await fetch(url, requestOptions);
  return handleResponse(response);
}

async function put(url: string, body: any) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  const response = await fetch(url, requestOptions);
  return handleResponse(response);
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(url: string) {
  const requestOptions = {
    method: "DELETE",
  };
  const response = await fetch(url, requestOptions);
  return handleResponse(response);
}

// helper functions

// function authHeader(url:string) {
//     // return auth header with jwt if user is logged in and request is to the api url
//     const user = userService.userValue;
//     const isLoggedIn = user && user.token;
//     const isApiUrl = url.startsWith(publicRuntimeConfig.apiUrl);
//     if (isLoggedIn && isApiUrl) {
//         return { Authorization: `Bearer ${user.token}` };
//     } else {
//         return {};
//     }
// }

async function handleResponse(response: Response) {
  const text = await response.text();
  let data: any = text && JSON.parse(text);
  if (!response.ok) {
    // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
    if ([401, 403].includes(response.status) && userService.userId)
      userService.logout();
    const error = data.message as string
    alert(error) // TODO remove this in production
    return Promise.reject(error);
  }
  return data;
}

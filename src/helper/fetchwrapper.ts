import { OKApiResponse } from "./constants";

export const fetchWrapper = {
  get,
  post,
  put,
  delete: _delete,
};

async function get<T>(url: string) {
  console.log("getting ", url);
  const requestOptions = {
    method: "GET",
  };
  const response = await fetch(url, requestOptions);
  return handleResponse<T>(response);
}

async function post<T>(url: string, body: any) {
  console.log("posting ", url);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  const response = await fetch(url, requestOptions);
  return handleResponse<T>(response);
}

async function put<T>(url: string, body: any) {
  console.log("putting ", url);
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  const response = await fetch(url, requestOptions);
  return handleResponse<T>(response);
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete<T>(url: string) {
  console.log("deleting ", url);
  const requestOptions = {
    method: "DELETE",
  };
  const response = await fetch(url, requestOptions);
  return handleResponse<T>(response);
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

async function handleResponse<T>(
  response: Response
): Promise<OKApiResponse<T>> {
  const text = await response.text();
  let data: any = text && JSON.parse(text);
  if (!response.ok) {
    const error = data.message as string;
    alert(error); // TODO remove this in production
    return Promise.reject(error);
  }
  return data;
}

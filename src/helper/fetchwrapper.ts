import { HttpCodes, OKApiResponse } from "./constants";
import userService from "./userService";

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

async function handleResponse<T>(
  response: Response
): Promise<OKApiResponse<T>> {
  const text = await response.text();
  let data: any = text && JSON.parse(text);
  if (!response.ok) {
    const error = data.message as string;
    try {
      window;
    } catch {
      console.error(error);
      return Promise.reject(error);
    }
    if (
      [HttpCodes.UNAUTHORIZED, HttpCodes.FORBIDDEN].includes(response.status)
    ) {
      // if we are in the browser
      // auto logout if 401 response returned from api
      console.log(error);
      alert("You are not authorized to do this action");
      userService.logout();
      window.location.href = "/login";
    } else {
      alert(error);
    }
    return Promise.reject(error);
  }
  return data;
}

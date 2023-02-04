import Cookies from "js-cookie";

const COOKIE_TTL = 7 * 24 * 3600 * 1000; // A week

function cookie_exp(ttl?: number | undefined) {
  return new Date(Date.now() + (ttl ?? COOKIE_TTL)).toUTCString();
}

// Check if cookies has a valid session (is connected) (used in backend only)
function isConnected(cookies: Partial<{ [key: string]: string }>): boolean {
  return !!cookies.session;
}

function isConnectedFront() {
  return !!Cookies.get("session")
}

// Check if cookies is a valid session (is connected), if user is provided (used in frontend only)
function checkValidUser(
  cookies: Partial<{ [key: string]: string }>,
  user: number
): boolean {
  // TODO create real sessions
  return cookies.session === String(user);
}

const cookieWrapper = {
  COOKIE_TTL,
  cookie_exp,
  back: {
    isConnected,
    checkValidUser,
  },
  front: {
    isConnected: isConnectedFront,
  },
};

export default cookieWrapper;

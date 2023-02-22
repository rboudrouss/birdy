import Cookies from "js-cookie";

const COOKIE_TTL = 7 * 24 * 3600 * 1000; // A week

function cookie_exp(ttl?: number | undefined) {
  return new Date(Date.now() + (ttl ?? COOKIE_TTL)).toUTCString();
}

function isConnectedFront() {
  return !!Cookies.get("session");
}

const cookieWrapper = {
  COOKIE_TTL,
  cookie_exp,
  front: {
    isConnected: isConnectedFront,
  },
};

export default cookieWrapper;

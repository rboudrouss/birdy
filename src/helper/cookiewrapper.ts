import Cookies from "js-cookie";
import { sessionTTL } from "./constants";

// in milliseconds
const COOKIE_TTL = (sessionTTL - 12 * 3600) * 1000; // A week - 12 hour

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

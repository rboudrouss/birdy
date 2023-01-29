const COOKIE_TTL = 7 * 24 * 3600 * 1000; // A week

const cookie_exp = (ttl: number | undefined) =>
  new Date(Date.now() + (ttl ?? COOKIE_TTL)).toUTCString();

const cookieWrapper = {
  COOKIE_TTL,
  cookie_exp,
};

export default cookieWrapper;

const COOKIE_TTL = 7 * 24 * 3600 * 1000; // A week

const cookie_exp = (ttl: number | undefined) =>
  new Date(Date.now() + (ttl ?? COOKIE_TTL)).toUTCString();

function isConnected(cookies: Partial<{ [key: string]: string }>):number {
  // TODO
  // Check if cookies has a valid session (is connected) & return user ID
  return 1
}

function checkValidUser(cookies: Partial<{ [key: string]: string }>, user?:number):boolean {
  // Check if cookies is a valid session (is connected), if user is provided
  // TODO verify cookie
  return true;
}

const cookieWrapper = {
  COOKIE_TTL,
  cookie_exp,
  isConnected,
  checkValidUser,
};

export default cookieWrapper;

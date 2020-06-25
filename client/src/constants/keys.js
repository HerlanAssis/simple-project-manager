const { REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_GOOGLE_SCOPE } = process.env;

export const CLIENT_ID = REACT_APP_GOOGLE_CLIENT_ID;
export const SCOPE = Array.isArray(REACT_APP_GOOGLE_SCOPE)
  ? REACT_APP_GOOGLE_SCOPE.join(" ")
  : REACT_APP_GOOGLE_SCOPE;
export const TOKEN_KEY = "token";
export const STATE_KEY = "state";
export const CODE_KEY = "code";

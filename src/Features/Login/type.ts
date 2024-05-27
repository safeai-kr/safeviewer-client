export interface FormValue {
  user_id: string;
  password: string;
  email: string;
  gender: string;
  name: string;
}

export interface IdType {
  loginId: string;
}
export interface LoginValue {
  user_id: IdType;
  password: string;
}

export interface TokenProps {
  access_token_cookie: string;
  csrf_access_token: string;
  csrf_refresh_token: string;
  refresh_token_cookie: string;
}

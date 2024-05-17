import { atom } from "recoil";

interface TokenProps {
  access_token_cookie: string;
  csrf_access_token: string;
  csrf_refresh_token: string;
  refresh_token_cookie: string;
}

export const Tokens = atom<TokenProps>({
  key: "Tokens",
  default: {
    access_token_cookie: "",
    csrf_access_token: "",
    csrf_refresh_token: "",
    refresh_token_cookie: " ",
  },
});

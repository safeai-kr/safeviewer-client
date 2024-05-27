import { atom } from "recoil";
import { IdType } from "../type";

export const LoginUser = atom<IdType>({
  key: "LoginUser",
  default: {
    loginId: "",
  },
});

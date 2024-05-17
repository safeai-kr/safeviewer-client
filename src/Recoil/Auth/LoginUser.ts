import { atom } from "recoil";
import { IdType } from "../../Login/type";

export const LoginUser = atom<IdType>({
  key: "LoginUser",
  default: {
    loginId: "",
  },
});

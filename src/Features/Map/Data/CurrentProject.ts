import { atom } from "recoil";

//recoil state 생성
export const CurrentProject = atom({
  key: "name",
  default: "",
});

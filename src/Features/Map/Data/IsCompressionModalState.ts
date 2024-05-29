import { atom } from "recoil";

//recoil state 생성
export const IsCompressionModalState = atom<boolean>({
  key: "IsCompressionModalState",
  default: false,
});

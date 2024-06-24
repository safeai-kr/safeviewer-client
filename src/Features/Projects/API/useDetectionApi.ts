import { useMutation } from "react-query";
import axios from "axios";

interface ApiData {
  image_url: string | null;
}
const useDetectionApi = () => {
  return useMutation((data: ApiData) => {
    return axios.post("https://mlapi.safeai.kr/detection/predict", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
};

export default useDetectionApi;

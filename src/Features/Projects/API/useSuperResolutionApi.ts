import { useMutation } from "react-query";
import axios from "axios";

interface ApiData {
  image_url: string | null;
}
const useSuperResolutionApi = () => {
  return useMutation((data: ApiData) => {
    return axios.post("https://mlapi.safeai.kr/resolution/predict", data, {
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "*",
      },
      // withCredentials: true,
    });
  });
};

export default useSuperResolutionApi;
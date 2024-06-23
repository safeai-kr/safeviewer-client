import { useMutation } from "react-query";
import axios from "axios";

interface ApiData {
  image_url: string | null;
}
const useCompressionApi = () => {
  return useMutation((data: ApiData) => {
    return axios.post("https://mlapi.safeai.kr/compression/predict", data, {
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "*",
      },
      // withCredentials: true,
    });
  });
};

export default useCompressionApi;

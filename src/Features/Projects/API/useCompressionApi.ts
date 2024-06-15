import { useMutation } from "react-query";
import axios from "axios";

interface ApiData {
  image_url: string | null;
}
const useCompressionApi = () => {
  return useMutation((data: ApiData) => {
    return axios.post("http://121.254.217.70:3000/predict/compression", data, {
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "*",
      },
      // withCredentials: true,
    });
  });
};

export default useCompressionApi;

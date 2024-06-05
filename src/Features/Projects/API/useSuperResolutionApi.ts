import { useMutation } from "react-query";
import axios from "axios";

interface ApiData {
  bucket: string;
  image_path: string;
}
const useSuperResolutionApi = () => {
  return useMutation((data: ApiData) => {
    return axios.post(
      "https://bento-img-classifier-cloud-run-service-rw7cysgb5a-od.a.run.app/predict",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
        },
        // withCredentials: true,
      }
    );
  });
};

export default useSuperResolutionApi;
import { useMutation } from "react-query";
import axios from "axios";

interface ApiData {
  image_base64: string | null;
  candidate_labels: string;
}
const useDetectionApi = () => {
  return useMutation((data: ApiData) => {
    return axios.post(
      "https://bento-img-classifier-cloud-run-service-rw7cysgb5a-od.a.run.app/predict/detection",
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

export default useDetectionApi;

import { useMutation } from "react-query";
import axios from "axios";

interface ApiData {
  image_url: string;
  candidate_labels: string;
}
const useCustomApi = () => {
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

export default useCustomApi;

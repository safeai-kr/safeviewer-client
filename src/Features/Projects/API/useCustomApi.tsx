import { useMutation } from "react-query";
import axios from "axios";

interface ApiData {
  dataframe_split: {
    columns: string[];
    data: string[][];
  };
}
const useCustomApi = () => {
  return useMutation((data: ApiData) => {
    return axios.post("http://121.254.217.70:5000/invocations", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
};

export default useCustomApi;

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
    return axios.post("/invocations", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
};

export default useCustomApi;

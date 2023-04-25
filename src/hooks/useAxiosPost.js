import { useContext } from "react";

import { AxiosContext } from "context/axiosContext";

const useAxiosPost = () => {
  const { axiosInstance, token } = useContext(AxiosContext);

  return { axiosInstance, token };
};

export default useAxiosPost;

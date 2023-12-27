import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const client = axios.create({
  baseURL: "http://localhost:4000",
});

export const request = ({ ...options }: AxiosRequestConfig) => {
  // 'options' is the list of options that you want to pass while doing a request
  // set header token here
  client.defaults.headers.common.Authorization = "Bearer <token>"; // get token from local storage, or any other way

  // handle on success method
  const onSuccess = (response: AxiosResponse) => response;

  // handle on error
  const onError = (error: AxiosError) => {
    // optionally catch error and add additional logging here
    return error;
  };

  //   return client(options).then(onSuccess).catch(onError);
  return client(options);
};

import axios from "axios";
import { Notification } from "element-ui";

export const request = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 30000,
});

request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log(error, "axios http 请求错误");
    return Promise.reject(error);
  }
);

const bizResponseErrorHandler = (response) => {
  const DEFAULT_ERROR_MSG = "服务器业务码异常，请稍等。。。";
  const DEFAULT_ERROR_MSG_TITLE = "系统提示！";

  Notification({
    title: DEFAULT_ERROR_MSG_TITLE,
    message: response?.data?.message ?? DEFAULT_ERROR_MSG,
    type: "error",
  });
};

const httpResponseErrorHandler = (response) => {
  const DEFAULT_ERROR_MSG = "服务器异常，请稍等。。。";
  const DEFAULT_ERROR_MSG_TITLE = "系统提示！";

  Notification({
    title: DEFAULT_ERROR_MSG_TITLE,
    message: response?.data?.message ?? DEFAULT_ERROR_MSG,
    type: "error",
  });
};

request.interceptors.response.use(
  (response) => {
    const contentType = response.headers["content-type"] ?? [];
    if (contentType.includes("application/json")) {
      const res = response.data;

      if (!res?.success) {
        bizResponseErrorHandler(response);

        return Promise.reject(new Error(res.message));
      }
      return res;
    } else {
      console.warn(
        response,
        "服务端返回了非json结构的数据,特别注意,(这意味着服务端返回了非标准返回格式)"
      );

      return response;
    }
  },
  (error) => {
    httpResponseErrorHandler(error.response);

    return Promise.reject(error);
  }
);

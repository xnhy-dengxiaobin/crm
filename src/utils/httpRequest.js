import Vue from "vue";
import axios from "axios";
import router from "@/router";
import qs from "qs";
import merge from "lodash/merge";
import { clearLoginInfo } from "@/utils";
import { META } from "./constant";

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json; charset=utf-8"
  }
});

/**
 * 请求拦截
 */
http.interceptors.request.use(
  config => {
    config.headers["token"] = Vue.cookie.get("token"); // 请求头带上token

    console.log("发送请求=========");
    console.log("token:" + config.headers.token);
    console.log(`请求url:${config.baseURL}${config.url}`);
    console.log(`请求头:${JSON.stringify(config.headers)}`);
    console.log(
      `请求参数:${JSON.stringify(
        config.method === "get" ? config.params : config.data
      )}`
    );

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截
 */
http.interceptors.response.use(
  response => {
    console.log("=========响应");
    console.log(`返回数据:${JSON.stringify(response)}`);

    if (response.data && response.data.code === 401) {
      // 401, token失效
      clearLoginInfo();
      router.push({ name: "login" });
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = actionName => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (
    (process.env.NODE_ENV !== "production" && process.env.OPEN_PROXY
      ? "/proxyApi/"
      : window.SITE_CONFIG.baseUrl) + actionName
  );
};

http.adornUrl2 = actionName => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (
    (process.env.NODE_ENV !== "production" && process.env.OPEN_PROXY
      ? "/proxyApi/"
      : window.SITE_CONFIG.baseUrl2) + actionName
  );
};

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    t: new Date().getTime()
  };
  return openDefultParams ? merge(defaults, params) : params;
};

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = "json") => {
  var defaults = {
    t: new Date().getTime()
  };
  data = openDefultdata ? merge(defaults, data) : data;
  return contentType === "json" ? JSON.stringify(data) : qs.stringify(data);
};

http.adornData2 = (data = {}, openDefultdata = true, contentType = "json") => {
  var defaults = {
    t: new Date().getTime(),
    systemNo: META.systemNo
  };
  data = openDefultdata ? merge(defaults, data) : data;
  return contentType === "json" ? JSON.stringify(data) : qs.stringify(data);
};

http.get = (action, params = {}, openDefultParams = true) => {
  let url = http.adornUrl(action);
  let success = params.success;
  let error = params.error;
  delete params.success;
  delete params.error;
  let prms = http.adornParams(params, openDefultParams);

  http({
    url: url,
    params: prms,
    method: "get"
  }).then(
    ({ data }) => {
      if (data && data.code === 0) {
        if (success) {
          success(data);
        }
      } else {
        console.log(data.msg);
        if (error) {
          error(data);
        }
      }
    },
    ({ err }) => {
      console.log(err);
    }
  );
};

http.post = (
  action = "",
  data = {},
  openDefultdata = true,
  contentType = "json"
) => {
  let url = http.adornUrl(action);
  let success = data.success;
  let error = data.error;
  delete data.success;
  delete data.error;
  let body = http.adornData(data, openDefultdata, contentType);

  http({
    url: url,
    data: body,
    method: "post"
  }).then(
    ({ data }) => {
      if (data && data.code === 0) {
        if (success) {
          success(data);
        }
      } else {
        console.log(data.msg);
        if (error) {
          error(data);
        }
      }
    },
    ({ err }) => {
      console.log(err);
    }
  );
};

http.get2 = (action, params = {}, openDefultParams = true) => {
  let url = http.adornUrl2(action);
  let success = params.success;
  let error = params.error;
  delete params.success;
  delete params.error;
  let prms = http.adornParams(params, openDefultParams);

  http({
    url: url,
    params: prms,
    method: "get"
  }).then(
    ({ data }) => {
      if (data && data.code === 1) {
        if (success) {
          success(data);
        }
      } else {
        console.log(data.msg);
        if (error) {
          error(data);
        }
      }
    },
    ({ err }) => {
      console.log(err);
    }
  );
};

http.post2 = (
  action = "",
  data = {},
  openDefultdata = true,
  contentType = "json"
) => {
  let url = http.adornUrl2(action);
  let success = data.success;
  let error = data.error;
  delete data.success;
  delete data.error;
  let body = http.adornData2(data, openDefultdata, contentType);

  http({
    url: url,
    data: body,
    method: "post"
  }).then(
    ({ data }) => {
      if (data && data.code === 1) {
        if (success) {
          success(data);
        }
      } else {
        console.log(data.msg);
        if (error) {
          error(data);
        }
      }
    },
    ({ err }) => {
      console.log(err);
    }
  );
};

http.doGet = param => {
  http.get2("/report/execBusiness", param);
};

http.doPost = param => {
  http.post2("/report/execBusiness", param);
};

export default http;

import axios, { AxiosInstance } from "axios";
import dotenv from "dotenv";
import {
  camelCase,
  snakeCase,
  isArray,
  isObject,
  mapKeys,
  mapValues,
} from "lodash";

if (typeof process !== "undefined") {
  dotenv.config();
}

let baseURL = "http://localhost:8000/api/";

const instance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthTokenHeader = (token: string | null) => {
  let t: string | null = `Bearer ${token}`;

  if (token === null) t = null;
  instance.defaults.headers.common["Authorization"] = t;
};

const toCamelCase = (obj: any): any => {
  if (isArray(obj)) {
    return obj.map((v) => toCamelCase(v));
  } else if (isObject(obj)) {
    return mapValues(
      mapKeys(obj, (_value, key) => camelCase(key)),
      (value) => toCamelCase(value),
    );
  } else {
    return obj;
  }
};

const toSnakeCase = (obj: any): any => {
  if (isArray(obj)) {
    return obj.map((v) => toSnakeCase(v));
  } else if (isObject(obj)) {
    return mapValues(
      mapKeys(obj, (_value, key) => snakeCase(key)),
      (value) => toSnakeCase(value),
    );
  } else {
    return obj;
  }
};

instance.interceptors.request.use(
  (config) => {
    if (config.data) {
      config.data = toSnakeCase(config.data);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = toCamelCase(response.data);
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const api = instance;

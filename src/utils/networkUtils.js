import axios from "axios";
import moment from "moment-timezone";
import { ref } from "vue";
import MyToaster from "@components/Toaster/MyToaster.vue";

// const toast = useToast();
const baseURL = import.meta.env.VITE_APP_BASE_URL || "http://31.97.49.224/api/monitoring/v1";

console.log("Base URL:", baseURL);

export const instance = axios.create({ baseURL });

export const getCookie = (name) => {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  } catch (error) {
    console.error("Error getting cookie:", error);
  }
  return null;
};

export const setCookie = (key, value, expiryHours) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + expiryHours * 60 * 60 * 1000);
  document.cookie = `${key}=${value};expires=${expires.toUTCString()};path=/`;
};

const logout = () => {
  const token = getCookie("tokenMonitoringMobile");
  if (!token) return;
  setCookie("tokenMonitoringMobile", null, -1);
  window.location.href = "/login";
};

const getHeader = (type = "json") => {
  const timezone = moment.tz.guess();
  let headers = {
    Authorization: `Bearer ${getCookie("tokenMonitoringMobile")}`,
  };

  if (type === "json") {
    headers["Content-Type"] = "application/json";
    headers["Accept-Language"] = "en";
    headers["Time-Zone"] = timezone;
  } else if (type === "form-data") {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    headers["Accept-Language"] = "en";
    headers["Time-Zone"] = timezone;
  }

  return headers;
};

export const get = async (endpoint, params, type = "json", timeout = 60000) => {
  try {
    const headers = getHeader(type);

    const response = await instance.get(endpoint, { headers, params, timeout });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const post = async (
  endpoint,
  data,
  type = "json",
  timeout = 60000,
  config = {}
) => {
  try {
    const headers = getHeader(type);
    const response = await instance.post(endpoint, data, {
      headers,
      timeout,
      ...config,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const patch = async (
  endpoint,
  data,
  params,
  type = "json",
  timeout = 60000,
  config = {}
) => {
  try {
    const headers = getHeader(type);
    const response = await instance.patch(endpoint, data, {
      headers,
      params,
      timeout,
      ...config,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const remove = async (endpoint, data, timeout = 60000) => {
  try {
    const headers = getHeader("json");
    const response = await instance.delete(endpoint, {
      headers,
      timeout,
      data,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const download = (endpoint, params) => {
  let url = `${baseURL}${endpoint}?token=${getCookie("tokenMonitoringMobile")}`;
  if (params) {
    Object.keys(params).forEach((key) => {
      url += `&${key}=${params[key] ?? ""}`;
    });
  }
  return url;
};

const handleApiError = (error) => {
  if (error.response?.status === 401) {
    MyToaster({
      status: error?.response?.status || 500,
      title: "Error",
      message: err?.response?.data?.message || "An error occurred.",
    });
    logout();
  } else if (error.response?.status === 403) {
    // toast.error("Access Denied: Your request was blocked by AWS WAF.");
  } else {
    // toast.error(error.response?.data?.message ?? "Something went wrong.");
  }
  throw error.response?.data ?? { message: "Unexpected error occurred." };
};

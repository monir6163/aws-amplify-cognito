"use server";

import { AxiosError } from "axios";
import axiosInstance from "./axiosInstance";

export const getTodos = async () => {
  try {
    const { data } = await axiosInstance.get(`/todos`);
    return data || [];
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    } else if (error instanceof Error) {
      return error.message;
    }
    return error;
  }
};

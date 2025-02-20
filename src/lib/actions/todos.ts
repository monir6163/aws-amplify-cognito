"use server";

import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import axiosInstance from "./axiosInstance";

export const getTodos = async () => {
  try {
    const { data } = await axiosInstance.get(`/todos`);
    revalidatePath("/tasks");
    return data?.data || [];
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    } else if (error instanceof Error) {
      return error.message;
    }
    return error;
  }
};

export const createTodo = async (formData: FormData) => {
  try {
    const todo = {
      title: formData.get("title"),
      description: formData.get("description"),
      status: formData.get("status"),
    };
    const { data } = await axiosInstance.post(`/todos`, todo);
    revalidatePath("/tasks");
    return data?.data || [];
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    } else if (error instanceof Error) {
      return error.message;
    }
    return error;
  }
};

export const updateTodo = async (formData: FormData, id: string) => {
  try {
    const todo = {
      title: formData.get("title"),
      description: formData.get("description"),
      status: formData.get("status"),
    };
    const { data } = await axiosInstance.put(`/todos/${id}`, todo);
    revalidatePath("/tasks");
    return data?.data || [];
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    } else if (error instanceof Error) {
      return error.message;
    }
    return error;
  }
};

export const deleteTodo = async (id: string) => {
  try {
    const { data } = await axiosInstance.delete(`/todos/${id}`);
    revalidatePath("/tasks");
    return data?.data || [];
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    } else if (error instanceof Error) {
      return error.message;
    }
    return error;
  }
};

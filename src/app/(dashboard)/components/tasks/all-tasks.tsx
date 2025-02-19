"use client";

import useAuthUser from "@/app/hooks/use-auth-user";
import axios from "axios";
import { useEffect, useState } from "react";
import { TableDemo } from "./todosTable";

axios.defaults.withCredentials = true;

async function featchAllTodos() {
  try {
    const response = await axios.get(
      "https://rjw2w5oiq7.execute-api.us-east-1.amazonaws.com/dev/todos"
    );
    console.log(response.data);
    return response.data;
  } catch (error) {}
}

export default function AllTasks() {
  const user = useAuthUser();
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    setLoading(true);
    if (user) {
      featchAllTodos().then((data) => {
        setTodos(data);
        setLoading(false);
      });
    }
  }, [user]);
  return <div>{loading ? "Loading..." : <TableDemo />}</div>;
}

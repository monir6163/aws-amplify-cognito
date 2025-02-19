"use client";

import useAuthUser from "@/app/hooks/use-auth-user";
import axios from "axios";
import { useEffect, useState } from "react";
import { TableDemo } from "./todosTable";

async function featchAllTodos(idToken: string) {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/todos`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    return data;
  } catch (error) {}
}

export default function AllTasks() {
  const user = useAuthUser();
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    setLoading(true);
    if (user) {
      featchAllTodos(user.idToken).then((data) => {
        setTodos(data);
        setLoading(false);
      });
    }
  }, [user]);
  return <div>{loading ? "Loading..." : <TableDemo />}</div>;
}

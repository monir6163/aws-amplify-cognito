import { getTodos } from "@/lib/actions/todos";
import AllTasks from "../../components/tasks/all-tasks";

export default async function page() {
  const todosData = await getTodos();
  console.log("todosData", todosData);
  return (
    <div>
      <AllTasks todosData={todosData} />
    </div>
  );
}

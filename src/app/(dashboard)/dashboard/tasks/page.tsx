import { getTodos } from "@/lib/actions/todos";
import { TableDemo } from "../../components/tasks/todosTable";

export default async function page() {
  const todosData = (await getTodos()) || [];
  return <>{todosData && <TableDemo todosData={todosData} />}</>;
}

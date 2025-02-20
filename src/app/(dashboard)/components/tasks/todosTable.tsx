"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteTodo } from "@/lib/actions/todos";
import { formatDistance, subDays } from "date-fns";
import { Eye, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DialogDemo } from "./todosModal";

export function TableDemo({ todosData = [] }: { todosData: any[] }) {
  const [open, setOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // deleteTodo
  async function deleteTodos(id: string) {
    toast.custom((t) => (
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <p>Are you sure you want to delete this todo?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => toast.dismiss(t)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              setLoading(true);
              try {
                const data = await deleteTodo(id);
                if (data) {
                  toast.success("Todo deleted successfully");
                  setOpen(false);
                }
              } catch (error) {
                if (error instanceof Error) {
                  toast.error(error.message);
                } else {
                  toast.error("An error occurred. Please try again.");
                }
              } finally {
                setLoading(false);
                toast.dismiss(t);
              }
            }}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    ));
  }
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          All Todos - {todosData && todosData?.length}
        </h2>
        <Button
          onClick={() => {
            setOpen(true);
            setSelectedTodo(null);
          }}
        >
          Create Todo +
        </Button>
      </div>
      <Separator className="my-4" />
      <Table>
        <TableCaption>
          {todosData && todosData?.length === 0
            ? "No todos found"
            : "List of all todos"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Staus</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(todosData) &&
            todosData?.map((todo: any, i: number) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell className="font-medium text-clip w-2/4">
                  {todo?.title}
                </TableCell>
                <TableCell>
                  {todo?.status === "pending" ? "Pending" : "Completed"}
                </TableCell>
                <TableCell className="w-[200px]">
                  {formatDistance(
                    subDays(new Date(todo?.createdAt), 0),
                    new Date(),
                    {
                      addSuffix: true,
                    }
                  )}
                </TableCell>
                <TableCell className="w-[200px]">
                  {formatDistance(
                    subDays(new Date(todo?.updatedAt), 0),
                    new Date(),
                    {
                      addSuffix: true,
                    }
                  )}
                </TableCell>
                <TableCell className="text-right flex justify-end space-x-2">
                  <Button variant="outline">
                    <Eye size={16} className="text-green-500" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setOpen(true);
                      setSelectedTodo(todo);
                    }}
                  >
                    <Pencil size={16} className="text-yellow-500" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => deleteTodos(todo?.id)}
                  >
                    <Trash size={16} className="text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* <DialogDemo /> */}
      {open && (
        <DialogDemo open={open} setOpen={setOpen} selectedTodo={selectedTodo} />
      )}
    </>
  );
}

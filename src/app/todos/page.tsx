"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Edit, Trash, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { toast } from "react-toastify";

type TodoType = {
  title: string;
  isComplete: boolean;
};
const TotosPage = () => {
  const [value, setValue] = useState("");
  const [editingTodo, setEditingTodo] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [todos, setTodos] = useState<TodoType[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isExist = todos.find(
      (todo) => todo.title.trim().toLowerCase() === value.trim().toLowerCase()
    );
    if (isExist) {
      return toast.error("Todo already exists!");
    }
    let updatedTodos: TodoType[];
    if (editingTodo) {
      updatedTodos = todos.map((todo) => ({
        ...todo,
        ...(editingTodo === todo.title ? { title: value } : {}),
      }));
      toast.success("Todo Updated!");
    } else {
      const newTodo = {
        title: value,
        isComplete: false,
      };
      updatedTodos = [newTodo, ...todos];
      toast.success("Todo Added!");
    }
    resetTodos(updatedTodos);
    resetFields();
  };

  const updateLocalStorage = (updatedTodos: TodoType[]) => {
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const deleteTodo = (title: string) => {
    const updatedTodos = todos.filter((todo) => todo.title !== title);
    setTodos(updatedTodos);
    updateLocalStorage(updatedTodos);
    toast.success("Todo was Deleted!");
  };

  const onEdit = (title: string) => {
    setValue(title);
    setEditingTodo(title);
    inputRef.current?.focus();
  };

  const onComplete = ({
    title,
    isComplete,
  }: {
    title: string;
    isComplete: boolean;
  }) => {
    const updatedTodos = todos.map((todo) => ({
      ...todo,
      ...(title === todo.title ? { isComplete: !isComplete } : {}),
    }));
    resetTodos(updatedTodos);
    toast.success(
      isComplete ? "Todo marked as Incomplete" : "Todo marked as Complete!"
    );
  };

  const resetTodos = (updatedTodos: TodoType[]) => {
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setEditingTodo("");
    setValue("");
  };

  const resetFields = () => {
    setEditingTodo("");
    setValue("");
  };

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
    setIsMounted(true);
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="h-full flex items-center justify-center"
    >
      <div className="w-full px-5 py-2 max-w-[500px] border rounded-xl shadow-lg space-y-3">
        <h3 className="font-bold text-xl text-center">Todo Application</h3>
        <div className="flex items-center gap-3">
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write your todo"
            maxLength={50}
          />
          <Button disabled={!!!value.trim()}>
            {editingTodo ? "Update Todo" : "Add Todo"}
          </Button>
        </div>
        {isMounted ? (
          <div className="">
            {todos.map(({ title, isComplete }, index) => (
              <div
                key={index}
                className="flex items-center gap-3 hover:bg-accent transition py-1.5 px-3 rounded-md"
              >
                <FaCircleCheck
                  onClick={() => onComplete({ title, isComplete })}
                  className={cn(
                    "h-6 w-6 text-primary cursor-pointer rounded-full",
                    !isComplete &&
                      "border-[1.5px] text-transparent border-primary hover:text-primary/20"
                  )}
                />
                <p
                  className={cn(
                    "font-semibold flex-1",
                    isComplete && "line-through"
                  )}
                >
                  {title}
                </p>
                <div className="flex gap-1">
                  {editingTodo === title ? (
                    <Button
                      onClick={resetFields}
                      type="button"
                      className="h-7 hover:bg-primary/20 text-muted-foreground hover:text-foreground"
                      variant="outline"
                    >
                      Undo
                      <X className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onEdit(title)}
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    onClick={() => deleteTodo(title)}
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7 text-destructive-foreground/70 hover:text-destructive-foreground"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-9" />
            ))}
          </div>
        )}
      </div>
    </form>
  );
};

export default TotosPage;

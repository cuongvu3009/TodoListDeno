import { addTodo, getTodos, deleteTodoById, editTodoById } from "./db.ts";

export async function addTodoHandler(title: string) {
  return await addTodo(title);
}

export async function getTodosHandler() {
  return await getTodos();
}

export async function deleteTodoByIdHandler(id: number) {
  return await deleteTodoById(id);
}

export async function editTodoByIdHandler(id: number, newTitle: string) {
  return await editTodoById(id, newTitle);
}

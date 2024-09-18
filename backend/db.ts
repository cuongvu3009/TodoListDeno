// db.ts
import { KvInterface } from "./types/kv_interface.ts";

let kv: KvInterface | null = null;

export function setKvInterface(kvInterface: KvInterface) {
  kv = kvInterface;
}

function ensureKvInitialized() {
  if (!kv) {
    throw new Error("KV interface not initialized. Call setKvInterface first.");
  }
}

export async function addTodo(title: string) {
  ensureKvInitialized();
  const id = Date.now();
  const todo = { id, title, completed: false };
  const key = ["todo", id.toString()];
  await kv!.set(key, todo);
  return todo;
}

export async function getTodos() {
  ensureKvInitialized();
  const todos = [];
  for await (const entry of kv!.list()) {
    if (entry.key[0] === "todo") {
      todos.push(entry.value);
    }
  }
  return todos;
}

export async function deleteTodoById(id: number) {
  ensureKvInitialized();
  const key = ["todo", id.toString()];
  const result = await kv!.get(key);
  if (result.value) {
    await kv!.delete(key);
    return true;
  }
  return false;
}

export async function editTodoById(id: number, newTitle: string) {
  ensureKvInitialized();
  const key = ["todo", id.toString()];
  const result = await kv!.get(key);
  if (result.value) {
    const updatedTodo = { ...result.value, title: newTitle };
    await kv!.set(key, updatedTodo);
    return updatedTodo;
  }
  return null;
}

// Integration Tests
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.178.0/testing/asserts.ts";
import { setKvInterface } from "../db.ts";
import { KvInterface } from "../types/kv_interface.ts";
import {
  addTodoHandler,
  deleteTodoByIdHandler,
  editTodoByIdHandler,
  getTodosHandler,
} from "../todo.ts";

class MockKv implements KvInterface {
  private data = new Map<string, any>();

  async set(key: string[], value: any) {
    this.data.set(key.join(","), value);
  }

  async get(key: string[]): Promise<{ value: any }> {
    return { value: this.data.get(key.join(",")) };
  }

  async delete(key: string[]) {
    this.data.delete(key.join(","));
  }

  async *list() {
    for (const [key, value] of this.data.entries()) {
      yield { key: key.split(","), value };
    }
  }

  clear() {
    this.data.clear();
  }
}

// Initialize the mock KV before running tests
const kv = new MockKv();
setKvInterface(kv);

Deno.test("addTodoHandler calls addTodo", async () => {
  const title = "Test Todo";
  const todo = await addTodoHandler(title);
  assertEquals(todo.title, title);
  const fetchedTodo = await kv.get(["todo", todo.id.toString()]);
  assertEquals(fetchedTodo.value.title, title);
});

Deno.test("getTodosHandler calls getTodos", async () => {
  await addTodoHandler("Test Todo 1");
  await addTodoHandler("Test Todo 2");
  const todos = await getTodosHandler();
  assertEquals(todos.length, 2);
});

Deno.test("deleteTodoByIdHandler calls deleteTodoById", async () => {
  const todo = await addTodoHandler("Test Todo to Delete");
  const success = await deleteTodoByIdHandler(todo.id);
  assertEquals(success, true);
  const fetchedTodo = await kv.get(["todo", todo.id.toString()]);
  assertEquals(fetchedTodo.value, undefined);
});

Deno.test("editTodoByIdHandler updates a todo", async () => {
  const todo = await addTodoHandler("Old Title");
  const updatedTodo = await editTodoByIdHandler(todo.id, "New Title");
  assertExists(updatedTodo);
  assertEquals(updatedTodo?.title, "New Title");
});

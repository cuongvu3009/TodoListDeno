// Unit Tests
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.178.0/testing/asserts.ts";
import {
  addTodo,
  getTodos,
  deleteTodoById,
  editTodoById,
  setKvInterface,
} from "../db.ts";
import { KvInterface } from "../types/kv_interface.ts";

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

const kv = new MockKv();
setKvInterface(kv);

Deno.test("addTodo adds a new todo", async () => {
  const todo = await addTodo("Test Todo");
  assertEquals(todo.title, "Test Todo");
  assertEquals(todo.completed, false);
  const fetchedTodo = await kv.get(["todo", todo.id.toString()]);
  assertEquals(fetchedTodo.value.title, "Test Todo");
});

Deno.test("getTodos returns all todos", async () => {
  await addTodo("Test Todo 1");
  await addTodo("Test Todo 2");
  const todos = await getTodos();
  assertEquals(todos.length, 2);
});

Deno.test("deleteTodoById deletes a todo", async () => {
  const todo = await addTodo("Test Todo to Delete");
  const success = await deleteTodoById(todo.id);
  assertEquals(success, true);
  const fetchedTodo = await kv.get(["todo", todo.id.toString()]);
  assertEquals(fetchedTodo.value, undefined);
});

Deno.test("editTodoById updates a todo", async () => {
  const todo = await addTodo("Old Title");
  const updatedTodo = await editTodoById(todo.id, "New Title");
  assertExists(updatedTodo);
  assertEquals(updatedTodo?.title, "New Title");
});

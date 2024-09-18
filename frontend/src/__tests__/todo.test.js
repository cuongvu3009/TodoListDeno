import { render, fireEvent, waitFor } from "@testing-library/svelte";
import TodoApp from "../App.svelte";
import { expect, test, vi } from "vitest";

// Mock fetch API
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]), // Return an empty list initially
  })
);

test("it renders the Todo app correctly", async () => {
  const { getByPlaceholderText, getByText, findByText } = render(TodoApp);

  // Simulate adding a new todo
  const input = getByPlaceholderText("Add a new todo");
  const addButton = getByText("Add Todo");

  // Mock fetch call for adding a todo
  fetch.mockResolvedValueOnce({
    json: () => Promise.resolve({ id: 1, title: "New Todo", completed: false }),
  });

  await fireEvent.input(input, { target: { value: "New Todo" } });
  await fireEvent.click(addButton);

  // Wait for the new todo to appear in the DOM
  await waitFor(() => expect(findByText("New Todo")).toBeTruthy());
});

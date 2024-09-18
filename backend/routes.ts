import {
  addTodoHandler,
  getTodosHandler,
  deleteTodoByIdHandler,
  editTodoByIdHandler,
} from "./todo.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  let response: Response;

  try {
    if (path === "/todos" && req.method === "GET") {
      const todos = await getTodosHandler();
      response = new Response(JSON.stringify(todos), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } else if (path === "/todos" && req.method === "POST") {
      const { title } = await req.json();
      if (title) {
        const newTodo = await addTodoHandler(title);
        response = new Response(JSON.stringify(newTodo), {
          status: 201,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } else {
        response = new Response("Bad Request", {
          status: 400,
          headers: corsHeaders,
        });
      }
    } else if (path.startsWith("/todos/") && req.method === "DELETE") {
      const id = parseInt(path.split("/")[2], 10);
      const success = await deleteTodoByIdHandler(id);
      response = success
        ? new Response(null, { status: 204, headers: corsHeaders })
        : new Response("Not Found", { status: 404, headers: corsHeaders });
    } else if (path.startsWith("/todos/") && req.method === "PUT") {
      const id = parseInt(path.split("/")[2], 10);
      const { title } = await req.json();
      if (title) {
        const updatedTodo = await editTodoByIdHandler(id, title);
        response = updatedTodo
          ? new Response(JSON.stringify(updatedTodo), {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            })
          : new Response("Not Found", { status: 404, headers: corsHeaders });
      } else {
        response = new Response("Bad Request", {
          status: 400,
          headers: corsHeaders,
        });
      }
    } else {
      response = new Response("Not Found", {
        status: 404,
        headers: corsHeaders,
      });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    response = new Response("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }

  return response;
}

import { serve } from "https://deno.land/std/http/server.ts";
import { handleRequest } from "./routes.ts";
import { setKvInterface } from "./db.ts";

// Initialize the KV store
const kv = await Deno.openKv();

// Set the KV interface
setKvInterface(kv);

console.log("Server running on http://localhost:8000");
await serve(handleRequest, { port: 8000 });

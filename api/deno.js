import { serve } from "https://deno.land/std@v0.24.0/http/server.ts";

const body = new TextEncoder().encode("Hello World\n");

const s = serve({ port: 8000 }); 

console.log("http://localhost:8000/");

for await (const req of s) {
  req.respond({ body });
}
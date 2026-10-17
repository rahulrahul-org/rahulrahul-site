// Shared helpers for the API handlers.

/** Bindings, environment variables and secrets available to the Worker. Add yours here. */
export interface Env {
  ASSETS: Fetcher; // the built site in ./dist
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  EXAMPLE_API_KEY?: string;
}

/** An API route handler: gets the request and env, returns a Response. */
export type Handler = (request: Request, env: Env) => Response | Promise<Response>;

export const json = (data: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  });

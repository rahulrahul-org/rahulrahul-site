// Shared helpers for the API functions. Files starting with "_" are not routes.

/** Environment variables / secrets available to every function. Add yours here. */
export interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  EXAMPLE_API_KEY?: string;
}

export const json = (data: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  });

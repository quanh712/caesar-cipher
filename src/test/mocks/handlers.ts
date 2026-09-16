import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("http://localhost:8080/api/caesar/:action", async ({ params, request }) => {
    const body = (await request.json()) as { text: string; key: number };
    return HttpResponse.json({
      success: true,
      result: `${params.action}:${body.key}:${body.text}`,
    });
  }),
];

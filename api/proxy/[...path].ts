import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path } = req.query;
  const targetUrl = `http://80.75.215.28:8000/${Array.isArray(path) ? path.join("/") : path}`;

  const { host, ...headersWithoutHost } = req.headers;
  const cleanHeaders: Record<string, string> = {};
  Object.entries(headersWithoutHost).forEach(([key, value]) => {
    if (value && typeof value === "string") {
      cleanHeaders[key] = value;
    } else if (value && Array.isArray(value)) {
      cleanHeaders[key] = value.join(", ");
    }
  });

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: cleanHeaders,
    body: req.method !== "GET" ? req.body : undefined,
  });

  const data = await response.text();
  res.status(response.status).send(data);
}

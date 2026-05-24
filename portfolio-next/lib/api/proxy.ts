import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "https://portfolio-backend-ckqx.onrender.com";

function buildUrl(path: string, search = "") {
  return `${BACKEND_URL}${path}${search}`;
}

export async function proxyJson(
  request: Request,
  path: string,
  init?: { method?: string; search?: string }
) {
  const response = await fetch(buildUrl(path, init?.search), {
    method: init?.method || request.method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: request.headers.get("authorization") || ""
    },
    body: ["GET", "HEAD"].includes(init?.method || request.method) ? undefined : await request.text()
  });

  const text = await response.text();

  return new NextResponse(text, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") || "application/json"
    }
  });
}

export async function proxyMultipart(
  request: Request,
  path: string,
  method = request.method
) {
  const formData = await request.formData();
  const response = await fetch(buildUrl(path), {
    method,
    headers: {
      Accept: "application/json",
      Authorization: request.headers.get("authorization") || ""
    },
    body: formData
  });

  const text = await response.text();

  return new NextResponse(text, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") || "application/json"
    }
  });
}

export async function proxyGet(path: string, search = "", authorization = "") {
  const response = await fetch(buildUrl(path, search), {
    headers: {
      Accept: "application/json",
      Authorization: authorization
    },
    cache: "no-store"
  });

  const text = await response.text();

  return new NextResponse(text, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") || "application/json"
    }
  });
}

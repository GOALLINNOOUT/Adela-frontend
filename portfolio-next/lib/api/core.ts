const BACKEND_URL = process.env.BACKEND_URL || "https://portfolio-backend-ckqx.onrender.com";

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status = 500, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function getBackendUrl(path: string) {
  return `${BACKEND_URL}${path}`;
}

export async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let data: any = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    throw new ApiError(
      (data && (data.message || data.error)) || "Request failed",
      response.status,
      data
    );
  }

  return data as T;
}

export async function backendFetch<T>(
  path: string,
  init?: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } }
): Promise<T> {
  const response = await fetch(getBackendUrl(path), init);
  return parseJsonResponse<T>(response);
}

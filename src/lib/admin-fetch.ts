type AdminFetchResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function adminFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<AdminFetchResult<T>> {
  try {
    const response = await fetch(`/api/admin${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        ok: false,
        error:
          typeof payload.error === "string"
            ? payload.error
            : "Something went wrong. Please try again.",
      };
    }

    return { ok: true, data: payload as T };
  } catch {
    return { ok: false, error: "Network error. Please check your connection." };
  }
}

const BASE_URL = "http://localhost:5000/api";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
}

/**
 * A centralized wrapper around the Fetch API.
 * @param endpoint The API endpoint to call (e.g., '/auth/login').
 * @param options Configuration for the request like method, body, etc.
 * @returns The JSON response from the server.
 * @throws An error with the server's message if the request fails.
 */
export async function apiService<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Automatically attach the auth token if it exists
  const token = localStorage.getItem("authToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // If the response is not OK, parse the error message from the body and throw it
  if (!response.ok) {
    // Handle expired tokens or unauthorized access
    if (response.status === 401) {
      localStorage.removeItem("authToken");
      // Reloading the page will force the user back to the login screen
      window.location.reload();
      throw new Error("Sua sessão expirou. Por favor, faça login novamente.");
    }

    const errorData = await response.json();
    throw new Error(errorData.message || "Ocorreu um erro no servidor.");
  }

  return response.json();
}

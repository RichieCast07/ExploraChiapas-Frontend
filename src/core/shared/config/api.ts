const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error(
    "Falta configurar VITE_API_BASE_URL en .env.local no sea bruto"
  );
}

export const BASE_URL = apiBaseUrl;
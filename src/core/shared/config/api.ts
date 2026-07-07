const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('Falta configurar VITE_API_BASE_URL');
}

export const BASE_URL = API_BASE_URL;
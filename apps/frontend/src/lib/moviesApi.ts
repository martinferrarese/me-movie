import { Movie } from "@me-movie/shared";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function searchMovies(query: string): Promise<Movie[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const res = await fetch(`${API}/movies?query=${encodeURIComponent(trimmed)}`);

  if (res.status === 404) return [];

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error del servidor: ${res.status} ${text}`);
  }

  return res.json();
}

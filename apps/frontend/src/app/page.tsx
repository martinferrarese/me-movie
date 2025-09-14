'use client';
import { useState } from 'react';
import { searchMovies } from '../lib/moviesApi';
import { Movie } from '@me-movie/shared';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchMovies(query);
      setResults(data);
      setSearched(true);
    } catch (err: unknown) {
      const message = err instanceof TypeError
        ? 'No se pudo conectar con el servidor backend.'
        : (err as Error).message;
      setError(message);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen py-10 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold">Me Movie</h1>
      <p className="text-gray-700">Buscá tu peli o serie favorita</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          aria-label="query"
          className="border p-2 rounded w-72"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Título..."
        />
        <button className="bg-blue-600 text-white px-4 rounded" disabled={loading}>
          Buscar
        </button>
      </form>
      {error && <p role="alert" className="text-red-600">{error}</p>}
      {loading && <p>Cargando...</p>}
      {searched && !loading && results.length === 0 && !error && (
        <p>No encontramos películas que coincidan con tu búsqueda.</p>
      )}
      <ul className="grid gap-4 mt-6">
        {results.map((movie) => (
          <li key={movie.imdbID} className="border p-4 rounded w-80">
            <p className="font-semibold">{movie.Title} ({movie.Year})</p>
            <p className="text-sm text-gray-600">{movie.Type}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

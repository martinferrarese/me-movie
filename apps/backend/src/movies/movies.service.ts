import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MoviesService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async search(
    query: string,
    options?: { type?: 'movie' | 'series' | 'episode'; page?: number },
  ) {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      throw new Error('La consulta de búsqueda está vacía');
    }

    const apiKey = this.config.get<string>('OMDB_API_KEY');
    if (!apiKey) {
      throw new Error('OMDB_API_KEY not set');
    }
    const params = new URLSearchParams({ apikey: apiKey, s: trimmedQuery });
    if (options?.type) params.append('type', options.type);
    if (options?.page) params.append('page', options.page.toString());
    const url = `https://www.omdbapi.com/?${params.toString()}`;
    const response = await firstValueFrom(this.http.get(url));
    const data = response.data;
    if (data.Response === 'False') {
      throw new HttpException(data.Error, 404);
    }
    return data.Search;
  }

  async getById(imdbID: string) {
    const apiKey = this.config.get<string>('OMDB_API_KEY');
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;
    const response = await firstValueFrom(this.http.get(url));
    return response.data;
  }

  async getByTitleExact(title: string) {
    const trimmedTitle = title.trim();
    const apiKey = this.config.get<string>('OMDB_API_KEY');
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(
      trimmedTitle,
    )}`;
    const response = await firstValueFrom(this.http.get(url));
    return response.data;
  }
}

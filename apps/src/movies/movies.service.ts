import { Injectable, HttpException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

@Injectable()
export class MoviesService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService
  ) {}

  async search(query: string) {
    const apiKey = this.config.get<string>("OMDB_API_KEY");
    if (!apiKey) {
      throw new Error("OMDB_API_KEY not set");
    }
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`;
    const response = await firstValueFrom(this.http.get(url));
    const data = response.data;
    if (data.Response === "False") {
      throw new HttpException(data.Error, 404);
    }
    return data.Search;
  }
}

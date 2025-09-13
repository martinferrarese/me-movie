import { Controller, Get, Query } from "@nestjs/common";
import { MoviesService } from "./movies.service";

@Controller("movies")
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  search(@Query("query") query: string) {
    return this.moviesService.search(query);
  }
}

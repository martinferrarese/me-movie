import { Controller, Get, Query, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from '@me-movie/shared';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  search(@Query('query') query: string): Promise<Movie[]> {
    return this.moviesService.search(query);
  }

  @Get('detail/:id')
  getById(@Param('id') id: string) {
    return this.moviesService.getById(id);
  }

  @Get('exact')
  getByTitleExact(@Query('title') title: string) {
    return this.moviesService.getByTitleExact(title);
  }
}

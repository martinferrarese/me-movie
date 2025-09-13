import { Controller, Get, Query, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  search(@Query('query') query: string) {
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

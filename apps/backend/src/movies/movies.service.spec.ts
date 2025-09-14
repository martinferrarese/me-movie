import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { HttpException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpService: HttpService;

  const httpServiceMock = {
    get: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn().mockReturnValue('dummy_key'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: HttpService, useValue: httpServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe devolver resultados de búsqueda', async () => {
    httpServiceMock.get.mockReturnValue(
      of({
        data: {
          Response: 'True',
          Search: [{ Title: 'Matrix' }],
        },
      }),
    );

    const result = await service.search('matrix');

    expect(result).toEqual([{ Title: 'Matrix' }]);
    expect(httpService.get).toHaveBeenCalledWith(
      expect.stringContaining('matrix'),
    );
  });

  it('debe lanzar HttpException cuando OMDb responde error', async () => {
    httpServiceMock.get.mockReturnValue(
      of({
        data: {
          Response: 'False',
          Error: 'Movie not found!',
        },
      }),
    );

    await expect(service.search('unknown')).rejects.toBeInstanceOf(
      HttpException,
    );
  });

  it('debe incluir filtros type y page en la URL', async () => {
    httpServiceMock.get.mockReturnValue(
      of({
        data: {
          Response: 'True',
          Search: [],
        },
      }),
    );

    await service.search('matrix', { type: 'movie', page: 2 });

    expect(httpService.get).toHaveBeenCalledWith(
      expect.stringContaining('type=movie'),
    );
    expect(httpService.get).toHaveBeenCalledWith(
      expect.stringContaining('page=2'),
    );
  });

  it('debe llamar getById', async () => {
    const fake = { Title: 'Matrix', imdbID: 'tt0133093' };
    httpServiceMock.get.mockReturnValue(of({ data: fake }));

    const result = await service.getById('tt0133093');
    expect(result).toBe(fake);
    expect(httpService.get).toHaveBeenCalledWith(
      expect.stringContaining('i=tt0133093'),
    );
  });

  it('debe llamar getByTitleExact', async () => {
    const fake = { Title: 'The Matrix', Year: '1999' };
    httpServiceMock.get.mockReturnValue(of({ data: fake }));

    const result = await service.getByTitleExact('The Matrix');
    expect(result).toBe(fake);
    expect(httpService.get).toHaveBeenCalledWith(
      expect.stringContaining('t=The%20Matrix'),
    );
  });

  it('debe ignorar espacios iniciales/finales en la búsqueda', async () => {
    httpServiceMock.get.mockReturnValue(
      of({
        data: {
          Response: 'True',
          Search: [{ Title: 'Matrix' }],
        },
      }),
    );

    const result = await service.search('  matrix   ');

    expect(result).toEqual([{ Title: 'Matrix' }]);
    expect(httpService.get).toHaveBeenCalledWith(
      expect.stringContaining('s=matrix'),
    );
  });

  it('debe ignorar espacios iniciales/finales en getByTitleExact', async () => {
    const fake = { Title: 'The Matrix', Year: '1999' };
    httpServiceMock.get.mockReturnValue(of({ data: fake }));

    const result = await service.getByTitleExact('   The Matrix   ');
    expect(result).toBe(fake);
    expect(httpService.get).toHaveBeenCalledWith(
      expect.stringContaining('t=The%20Matrix'),
    );
  });
});

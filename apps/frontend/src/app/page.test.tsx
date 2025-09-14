import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import Home from './page';
import { Movie } from '@me-movie/shared';

jest.mock('../lib/moviesApi', () => ({
  __esModule: true,
  searchMovies: jest.fn(),
}));

import { searchMovies } from '../lib/moviesApi';

function mockApi(data: unknown, reject = false) {
  (searchMovies as jest.Mock).mockImplementationOnce(async () => {
    if (reject) throw new TypeError('Network error');
    return data as Movie[];
  });
}

describe('Home page', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('muestra resultados cuando la búsqueda devuelve datos', async () => {
    mockApi([{ Title: 'Matrix', Year: '1999', imdbID: '1', Type: 'movie' }]);
    render(<Home />);
    fireEvent.change(screen.getByLabelText('query'), { target: { value: 'matrix' } });
    fireEvent.click(screen.getByText('Buscar'));

    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByText('Cargando...')).not.toBeInTheDocument());

    expect(screen.getByText(/Matrix/)).toBeInTheDocument();
  });

  it('muestra mensaje de sin resultados', async () => {
    mockApi([]);
    render(<Home />);
    fireEvent.change(screen.getByLabelText('query'), { target: { value: 'xyz' } });
    fireEvent.click(screen.getByText('Buscar'));
    await waitFor(() => screen.getByText('No encontramos películas que coincidan con tu búsqueda.'));
  });

  it('muestra error cuando la petición falla', async () => {
    mockApi([], true);
    render(<Home />);
    fireEvent.change(screen.getByLabelText('query'), { target: { value: 'matrix' } });
    fireEvent.click(screen.getByText('Buscar'));
    await waitFor(() => screen.getByText('No se pudo conectar con el servidor backend.'));
  });

  it('muestra descripción inicial', () => {
    render(<Home />);
    expect(screen.getByText('Buscá tu peli o serie favorita')).toBeInTheDocument();
  });
});

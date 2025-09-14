import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './page';

function mockFetchOnce(data: unknown, ok = true) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: async () => data,
    text: async () => JSON.stringify(data),
  }) as unknown as jest.Mock;
}

describe('Home page', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('muestra resultados cuando la búsqueda devuelve datos', async () => {
    mockFetchOnce([{ Title: 'Matrix', Year: '1999', imdbID: '1', Type: 'movie' }]);
    render(<Home />);
    fireEvent.change(screen.getByLabelText('query'), { target: { value: 'matrix' } });
    fireEvent.click(screen.getByText('Buscar'));

    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByText('Cargando...')).not.toBeInTheDocument());

    expect(screen.getByText(/Matrix/)).toBeInTheDocument();
  });

  it('muestra mensaje de sin resultados', async () => {
    mockFetchOnce([]);
    render(<Home />);
    fireEvent.change(screen.getByLabelText('query'), { target: { value: 'xyz' } });
    fireEvent.click(screen.getByText('Buscar'));
    await waitFor(() => screen.getByText('No encontramos películas que coincidan con tu búsqueda.'));
  });

  it('muestra error cuando la petición falla', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Network error')) as unknown as jest.Mock;
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

# Movie Search Monorepo

Aplicación para buscar películas usando la API pública de OMDb.  
Stack:

- **Backend** – NestJS (TypeScript) → `apps/backend`
- **Frontend** – Next.js (TypeScript, App Router) → `apps/frontend` (en construcción)
- **Gestor de paquetes** – npm workspaces

---

## Requisitos

- Node 18+
- npm 8+
- Clave gratuita de OMDb (obtener en https://www.omdbapi.com/apikey.aspx y ACTIVARLA desde el email)

---

## Instalación

```bash
# clonar el repo
git clone git@github.com:<tu_usuario>/movie-search.git
cd movie-search

# instalar dependencias de todo el monorepo
auth npm install
```

### Variables de entorno

Crear un archivo `.env` en la raíz (o exportar como env var) con:

```dotenv
OMDB_API_KEY=<TU_CLAVE_ACTIVA>
```

---

## Comandos útiles

```bash
# Levantar backend NestJS en modo watch
npm run start:dev --workspace=apps/backend

# Ejecutar todos los tests del backend
npm test --workspace=apps/backend
```

> El frontend Next.js aún no está implementado; en desarrollo.

---

## API REST

### Búsqueda parcial

`GET /movies?query=matrix[&type=movie|series|episode][&page=2]`

Retorna arreglo de coincidencias (máx 10 por página).

### Búsqueda exacta por título

`GET /movies/exact?title=The+Matrix`

### Detalle por IMDb ID

`GET /movies/detail/tt0133093`

Ejemplo de respuesta:

```json
{
  "Title": "The Matrix",
  "Year": "1999",
  "imdbID": "tt0133093",
  "Type": "movie",
  "Poster": "https://..."
}
```

---

## Estructura de carpetas

```text
apps/
  backend/   # NestJS
  frontend/  # Next.js (WIP)
```

---

## Roadmap breve

1. Completar frontend (Next.js) con formulario de búsqueda y página de detalle.
2. Dockerización y despliegue.
3. Autenticación básica y favoritos.

---

## Licencia

MIT

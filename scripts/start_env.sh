#!/bin/bash

# Script: start_env.sh
# Descripción: Levanta los servicios de backend y frontend en modo desarrollo.
# Uso: ./scripts/start_env.sh
# Requisitos: npm >= 7 (soporta workspaces)

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Iniciar Backend
echo "Iniciando backend (NestJS) en modo watch..."
npm --workspace apps/backend run start:dev &
BACKEND_PID=$!

# Iniciar Frontend
echo "Iniciando frontend (Next.js) en modo dev..."
PORT=3001 npm --workspace apps/frontend run dev &
FRONTEND_PID=$!

cat <<EOF
========================================
Entorno levantado correctamente.
  Backend  -> http://localhost:3000 (por defecto Nest)
  Frontend -> http://localhost:3001 (por defecto Next)
PID Backend : $BACKEND_PID
PID Frontend: $FRONTEND_PID
Presiona Ctrl+C para detenerlos.
========================================
EOF

# Esperar a que cualquiera de los procesos termine
wait -n $BACKEND_PID $FRONTEND_PID

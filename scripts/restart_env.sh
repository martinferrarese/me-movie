#!/bin/bash

# Script: restart_env.sh
# Descripción: Reinicia el entorno backend + frontend parando procesos existentes.
# Uso: ./scripts/restart_env.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
START_SCRIPT="$SCRIPT_DIR/start_env.sh"

# Kill running node dev processes for this workspace (simple heuristic)
PIDS=$(pgrep -f "(nest start --watch|next dev)" || true)
if [ -n "$PIDS" ]; then
  echo "Matando procesos existentes: $PIDS"
  kill $PIDS || true
  sleep 2
fi

echo "Reiniciando entorno..."
"$START_SCRIPT"

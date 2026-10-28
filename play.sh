#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
command -v python3 >/dev/null || { echo 'Python 3 is required.' >&2; exit 1; }
for file in index.html game.js style.css; do
  test -f "$file" || { echo "Missing game file: $file" >&2; exit 1; }
done
printf 'Starting River Quest on port %s. Press Ctrl+C to stop.\n' "${PORT:-8000}"
exec python3 -m http.server "${PORT:-8000}" --bind "${BIND_ADDRESS:-127.0.0.1}"

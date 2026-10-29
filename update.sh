#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo 'Save your tracked changes in a commit or stash before updating.' >&2
  exit 1
fi
# Git also refuses to overwrite untracked files or merge divergent history.
git pull --ff-only origin main
if command -v node >/dev/null; then
  node --check biomes.js
  node --check league.js
  node --check dragon-cave.js
  node --check game.js
fi
echo 'Update complete. Refresh the browser; no build or dependency install is needed.'

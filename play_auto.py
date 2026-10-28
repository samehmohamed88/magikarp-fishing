#!/usr/bin/env python3
"""Serve River Quest locally and periodically pull clean updates from origin/main."""

import argparse
import functools
import http.server
import os
from pathlib import Path
import shutil
import subprocess
import threading


ROOT = Path(__file__).resolve().parent


def log(message):
    print(f"[updates] {message}", flush=True)


def update_once():
    def git(*args):
        return subprocess.run(
            ["git", *args], cwd=ROOT, text=True, capture_output=True,
            timeout=30,
            env={**os.environ, "GIT_TERMINAL_PROMPT": "0", "GCM_INTERACTIVE": "Never"},
            check=True,
        ).stdout.strip()

    try:
        if git("branch", "--show-current") != "main":
            log("Skipped: switch to main to receive automatic updates.")
            return
        if git("status", "--porcelain", "--untracked-files=no"):
            log("Skipped: local tracked edits found. Commit or stash them to resume updates.")
            return
        before = git("rev-parse", "HEAD")
        git("-c", "merge.autoStash=false", "-c", "rebase.autoStash=false",
            "pull", "--ff-only", "--no-rebase", "origin", "main")
        after = git("rev-parse", "HEAD")
        log("Up to date." if before == after else "Updated! Refresh the game in your browser.")
    except subprocess.TimeoutExpired:
        log("Git timed out; the game stays available. Will retry next interval.")
    except subprocess.CalledProcessError as error:
        # Do not expose remote URLs or authentication diagnostics in routine logs.
        log(f"Git exited with code {error.returncode}; no update applied. "
            "Check connectivity or run ./update.sh for details. The server stays running.")
    except OSError as error:
        log(f"Cannot run Git ({error.__class__.__name__}); the server stays running.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--interval", type=int, default=60, help="seconds between update checks (default: 60)")
    args = parser.parse_args()
    if not 1 <= args.port <= 65535 or args.interval < 1:
        parser.error("port must be 1–65535 and interval must be at least 1 second")
    if not shutil.which("git"):
        parser.error("Git must be installed and available on PATH")
    for name in ("index.html", "game.js", "style.css"):
        if not (ROOT / name).is_file():
            parser.error(f"missing game file: {name}")

    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT))
    try:
        server = http.server.ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    except OSError as error:
        parser.error(f"cannot start local server: {error}. Try --port 8001.")

    stop = threading.Event()

    def poll():
        while not stop.is_set():
            update_once()
            stop.wait(args.interval)

    worker = threading.Thread(target=poll, daemon=True)
    worker.start()
    print(f"Play at http://localhost:{args.port}/", flush=True)
    print(f"Checking origin/main every {args.interval} seconds. Ctrl+C stops the launcher.", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping local server and update checks.", flush=True)
    finally:
        stop.set()
        server.server_close()


if __name__ == "__main__":
    main()

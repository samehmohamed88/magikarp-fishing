# Running and updating River Quest

This is a static HTML/CSS/JavaScript game. It needs Python 3 to serve it.
There are no npm dependencies, build steps, backend services, or required secrets.

## Launch

For a local server with automatic GitHub updates, run `python3 play_auto.py`
(Windows: `py play_auto.py`). It binds to loopback on port 8000 and checks
`origin/main` immediately and every 60 seconds. Use `--interval 120 --port 8001`
to customize. Run it from the main branch with a clean tracked working tree;
otherwise updates are skipped. Git uses fast-forward-only pulls with auto-stash
disabled. Conflicting untracked files are protected by Git. Network failures do
not stop the server. Refresh the browser after updates. Ctrl+C stops the server
and its update worker; restart to load changes to the launcher itself.
The launcher disables browser caching and prints the current Git commit after
each successful update check. Already-open tabs still need a refresh to run new
game code. The **Preview shiny forms** button in Collection identifies the version
with drawn shiny sprites and the preview gallery.

From this checkout, run `./play.sh`. The default port is 8000; use
`PORT=8001 ./play.sh` to choose another. Stop it with Ctrl+C.
On your own computer, open the local server address printed by Python.
Cloud onboarding does not provide a browser preview link.
For a hosting environment that requires a listener on all interfaces, set
`BIND_ADDRESS=0.0.0.0` only when needed.

Edit the three game files and refresh the browser. The server serves changes
immediately. Progress is stored in browser localStorage under `mkrq` and belongs
to that browser and origin (including its port). Keep the same port to retain it.
The optional Google Font uses fonts.googleapis.com and fonts.gstatic.com;
the game uses a fallback font when these are unavailable.

## Repeatable updates

Run `./update.sh` to pull `origin/main` with fast-forward-only behavior.
It refuses tracked edits, divergent history, and conflicting untracked files;
it never resets, deletes, automatically stashes, or pushes your work.
Commit or stash your work intentionally before retrying a refused update.
Commit and push intentional changes when you want GitHub to distribute them.
Environment publication retains the prepared filesystem separately from Git.

No install or server restart is needed for game updates: refresh the browser.
Node.js, when available, checks JavaScript syntax after an update.

## Validation

Run `node --check game.js` for a syntax check. With the server running, verify
that the world renders, WASD/arrows move, P opens/closes Party, C opens/closes
Collection, and Space casts/reels when facing water. Catch a creature and refresh
to check persistence. Touch controls are also available on small screens.
With at least one caught creature, walk next to a trainer marked ! to test battle
startup, Attack/Space, the one-use Heal, retreat, and party switching. A win gives
every party member a level and saves a check mark on that trainer. Verify it stays
after refreshing. Losing or retreating must leave caught creatures and saves intact.
Test manual Switch with multiple party members: switching costs one turn and
preserves each creature's HP; canceling costs none. Active/fainted choices are
disabled. After a faint, any surviving party member can take over regardless of
party order. Check mouse, keyboard, and touch selection.
Water wildlife must swim and respawn only on water. Fish into a visible creature's
tile to target it; open-water fishing should include all eight fishing species.
Verify each new aquatic creature has a distinct normal/shiny sprite in encounters,
Collection, Party/Box, and battles, and survives save/reload. They must not appear
in grass or winter encounter pools.

Cloud tasks already have isolated checkouts. Use this checkout directly;
do not create a Git worktree unless explicitly requested.

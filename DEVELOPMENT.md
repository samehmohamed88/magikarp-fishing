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
There should be 24 surface swimmers, three per fishing species, plus 21 diving-only
creatures (three per exclusive species). All 45 occupy distinct water tiles.
Open-water weights total 100: Catfish 20, each other new water creature 14,
Magikarp 5, and Frog 5. Visible-swimmer targeting overrides these weights.
Catch difficulty: every species has a first-ball rate of at least 92%, second
throws always succeed, and failed catches cannot make creatures flee. The fishing
bite window is four seconds. Verify a forced first failure followed by a second
catch, preserving shiny state and saved Party/Box entries.
The ten new woodland species share weight 20 each in the meadow encounter pool
(16 total meadow species), including sparkling grass. They have no fishing weight
and do not enter the separate winter or mountain pools. Verify distinct normal
and shiny sprites for encounters, Party/Box, Collection (45 species), and battles,
as well as catch/save/reload compatibility with existing saves.
Fishing shiny probabilities: Alligator 75%; Shark, Catfish, Grunt, Spiny Dogfish,
and Crocodile 50%; Magikarp and Frog retain 1/8. Sparkling casts guarantee a shiny
of any fishing species. Verify threshold boundaries and a shiny Alligator's
capture/save/reload. Land shiny probabilities remain unchanged.
Sparkling fishing spots override visible swimmer targeting: 95% shiny Alligator,
5% another shiny fishing species (the fallback pool excludes Alligator). Test
the .95 boundary and the full cast/bite/reel flow; non-sparkling casts retain
their existing species and shiny odds. Land sparkles are unaffected.
Party can be completely empty: single-card moves include the last creature,
and Move all to Box stores the whole party. Verify save/reload and restoring a
creature from Box, preserving levels, shiny flags, and Collection counts. Empty
parties cannot start battles and receive guidance to add a boxed creature.

Cloud tasks already have isolated checkouts. Use this checkout directly;
do not create a Git worktree unless explicitly requested.

## Scuba validation

Dive buoys are at map tiles (19,9), (41,13), and (30,23). In a boat, press V
or tap Dive at a buoy. Entry elsewhere is refused. Underwater movement is limited
to the marked river regions; V or Surface returns to a boat anywhere within them.
Check both keyboard and touch. Space provides guidance underwater rather than
casting a rod. Surface fishing, trainer battles, and WASD retain their controls.

All eight fishing species swim smoothly and show their actual shiny colors.
Swim into a creature, or let it swim into you, to start an encounter with that
species and shiny flag. After catching or running, the swimmer respawns elsewhere;
a short grace period prevents immediate repeat encounters. Collision encounters
only happen while diving. There is no oxygen timer. Dive state saves under mkrq
and old saves without it remain compatible. The frog uses a drawn green/blue
sprite so its shiny no longer depends on the operating system's emoji font.

Diving-only species: Narwhal, Crab, Lobster, Starfish, Mussel, Octopus, Squid.
They have water and diveOnly flags but no fishingWeight or land weight. Verify
that fishing a tile occupied by one uses the normal fishing pool, including
sparkling casts; they must never appear in fishing or land encounter pools.
They are hidden above water, stay in dive regions when moving or respawning,
and keep their species and shiny flag through collision/capture/save/reload.
Check all seven normal/shiny drawings in Collection, encounters, Party/Box, and
battles. Collection gives a Diving only hint for undiscovered exclusive species.

## Cave and encounter-frequency validation

The tunnel is at surface tile (5,5), centered in the starting clearing. Space or
Enter tunnel works on that tile or an adjacent tile. The cave has a separate map
layer with connected chambers and an exit ladder at (8,8); Space or Exit cave
returns to surface tile (5,6). Cave walls block movement, while dirt and shallow
pools are walkable. Entering/exiting clears held movement keys and fishing.

There are 18 cave creatures, three each of Mole, Ant, Spider, Cricket, Praying
Mantis, and Cave Crawfish. They only encounter by contact underground. Crawfish
stay in shallow pools; the others stay on dirt. All have distinct normal/shiny
sprites. They never join surface, fishing, winter, mountain, or diving pools.
Check movement and respawn boundaries, capture, Party/Box, Collection (45 species),
preview sprites, and persistence. Cave encounters use a separate cave background.
Old saves without underground default to the surface; cave saves reload on the
cave layer, with invalid cave positions recovered at the ladder. Surface wildlife
and rivals must stay on their layer and remain usable after exiting. Check touch
entry/exit and that the ladder is always reachable from each chamber.

Random grass/mountain encounters have an 8% per-step chance; snow has 10%.
Verify exact thresholds, four seconds of cooldown after a wild encounter ends,
and suppression of automatic cave/dive contact encounters during that cooldown.
Intentional fishing is still available, and trainers retain their existing rules.

## Cave stone generator validation

Rubies (10,5), Sapphires (13,5), and Limestone (16,5) are in the front of the
entrance chamber. The generator is beside the ladder at (11,10); its tile blocks
walking, and any adjacent tile can activate it. Verify all objects are reachable
from the ladder and that bright pile frames, arrows, and labels remain legible.
Walking onto an uncollected pile or pressing Space/tapping Collect beside it saves
its collection. No dinosaur is granted until Insert is selected at the generator.

The three generator-only species have habitat=generator and no wild/fishing
weights. They never spawn as cave wildlife, swimmers, or normal wild encounters.
Rubies give Tyrannosaurus rex, Sapphires give Spinosaurus, and Limestone gives
Giganotosaurus. Each is a normal level-10 dinosaur, awarded once per save; every
pile/reward is independent, allowing all three in any order. Full parties route
rewards to Box. Collection counts and caveTreasures.collected/generated save
immediately. Old saves without these fields start with all three available.

Check missing-pile and duplicate-claim guards, collecting without awarding,
reloads between collecting and generating, all six reward orders, full-party Box
routing, Collection/Party rendering, and keyboard/touch controls. The generator
modal pauses encounters/movement and blocks opening other menus; Escape exits.

## Seasonal Halloween validation

Halloween Forest replaces meadow tiles x=8..16, y=2..17 northeast of spawn during
October only. Its entrance path is at (8,5). Trainer clearings and the cave tunnel
are preserved. Outside October, the exact original terrain returns. Seasonal map
updates run every second and on tab visibility changes; underground activeMap
must remain caveMap during these updates. A displaced player or saved position
on a returning tree is recovered to (7,5). Old meadow sparkles are removed when
their tile no longer supports them.

halloweenCalendar uses the browser's local year/month/day, never a hardcoded year
or the server timezone. Test Sep 30 → Oct 1, Oct 30 → Oct 31, Oct 31 → Nov 1,
and the following October with a browser clock and America/New_York timezone.
Skeleton, Crow, and Zombie are forest-only encounters; Ghost is available on
Oct 31 only with 5% probability per forest encounter (strictly below .05).
Forest step encounters remain 8% with the existing four-second cooldown. None of
the four species enters meadow, fishing, cave, or swimmer pools. Encounter entry
also checks the calendar to prevent stale seasonal availability.

Test all four normal/shiny sprite pairs, catching, and save/reload into November.
Party, Box, and Collection (45 species) must keep seasonal catches after the event.
An in-progress encounter may finish after midnight; only new spawns are gated.

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
and shiny sprites for encounters, Party/Box, Collection (95 species), and battles,
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
Check movement and respawn boundaries, capture, Party/Box, Collection (95 species),
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

The three dinosaur species have habitat=generator and no wild/fishing weights.
They never spawn in the normal cave, as swimmers, or in normal wild encounters.
Their shiny forms also roam the separate seasonal Halloween Cavern.
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

Forest floor (HF) tiles support the same golden sparkle spots as other habitats.
Walking onto one consumes it and guarantees a shiny seasonal encounter, including
during the short grace period after a previous encounter. The species picker
still restricts Ghosts to October 31. Verify sparkle spawning and visible rendering,
capture/save of the shiny form, and season rollover: forest sparkles survive a
date change within October, but spots on restored non-sparkle terrain disappear
when the forest closes.

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
the four species enters meadow, fishing, normal cave, or swimmer pools. Encounter entry
also checks the calendar to prevent stale seasonal availability.

Test all four normal/shiny sprite pairs, catching, and save/reload into November.
Party, Box, and Collection (95 species) must keep seasonal catches after the event.
An in-progress encounter may finish after midnight; only new spawns are gated.

## Deep Sea validation

From any valid shallow scuba position, B / Dive deeper enters a separate basin
at (8,8). V / Shallows returns to the saved shallow position; V again
surfaces. The deep generator at (9,8) is adjacent to the entrance and blocks
movement onto its tile. Moonstones (3,10), Sunstones (56,12), and Abyss Crystals
(3,34) are reachable along the basin sides. Space, the action button, and walking
onto a pile collect it. Contextual controls and the quest tracker show progress.

Deep wildlife contains three each of all eight fishing species, seven shallow
diving-only species, and five deep-only species (60 swimmers total). Giant Squid,
Colossal Squid, Great White Shark, Tiger Shark, and Orca have deepOnly=true and
must not appear in fishing or shallow wildlife. All normal/shiny art differs.
Surface sparkle coordinates must not affect deep-water shiny status. Rocks block
movement; the entrance and stone/generator interactions protect against collisions.

Generator rewards are Mosasaurus, Megalodon, and Elasmosaurus, each a normal
level-10 creature with habitat=deep-generator and no wild/fishing eligibility.
Each stone grants one independent reward; missing stones, duplicate insertion,
and cross-generator stone IDs must not grant rewards. Full parties route to Box.
Deep quest data saves as deepTreasures; caveTreasures remains separate. Deep
location and return point save as deepDiving and shallowReturn. Invalid deep
positions recover to the entrance; invalid return points use the first dive buoy.
Existing shallow/cave saves retain their behavior.

Verify keyboard and button depth transitions, all 20 species, collision/capture,
respawns within bounds, all eight new sprite pairs, both generator workflows,
save/reload between collection and reward, duplicate guards, Party/Box/Collection,
and date rollover while deep diving. Update asset query versions when shipping.

## Abyss, diver trainers, and wild combat validation

B descends from shallows to Deep Sea to Abyss; V ascends one level. Abyss uses
abyssDiving=true together with deepDiving=true, its own map and wildlife, and an
entrance at (8,8). deepReturn stores the previous level-2 position; shallowReturn
retains the level-1 position. Validate both return points and repair invalid saved
positions to the appropriate entrance. Old deep saves without abyssDiving remain
on level 2. Neither cave nor surface seasonal updates should change the dive map.

The Abyss has 60 swimmers, five of each of 12 exclusive species: Anglerfish, Gulper
Eel, Dumbo Octopus, Goblin Shark, Frilled Shark, Viperfish, Dragonfish, Barreleye,
Vampire Squid, Giant Isopod, Nautilus, and Sea Pig. Test unique normal/shiny art at
swimmer, encounter, icon, and battle sizes; reachable spawn tiles; respawn bounds;
collision capture; saved shiny catches; and exclusion from other wildlife pools.
Load a pre-expansion Abyss save to verify old catches, generator rewards, trainer
wins, and both return points survive while all new species become available.
Catch new species into both Party and a full-party Box, reload, and use one in a
diver battle. Collection must list 95 species and preview every shiny form.
No stone piles, generator interactions, or level-2 trainers appear in the Abyss.

Level-2 diver trainers have separate IDs in trainerWins. Their tiles block movement
and wildlife spawns; only adjacent players on the same level can challenge them.
Test empty-party prompts, all trainer teams, attacks/healing/switching, retreat and
reapproach, victory/level rewards, saved wins, and underwater battle presentation.
Depth changes and wild encounters must remain paused during trainer battles.

Wild encounters keep HP and temporary party HP in enc. X / Attack lowers wild HP
to a minimum of 1 and improves catch odds. The wild creature retaliates after each
attack and failed ball, knocks out allies at 0 HP, and auto-switches to the next
survivor. A full-party knockout disables attacks and catches until leaving. Party
HP resets on the next encounter; saved catches and party membership remain intact.
Verify no-party starter catches, catch odds at full/partial/1 HP, successful and
failed balls, second-ball guarantee, knockout/auto-switch/retreat, action guards
during animations, mobile controls, and cancellation at seasonal cavern closing.

## Halloween Cavern validation

During October, the surface entrance is (12,10), in the middle of Halloween Forest. Its separate
map has an exit at (8,8), connected rooms, and walkable crawfish pools. `underground`
stays true while `halloweenCavern` selects this map, wildlife, rendering, and save
location. Legacy saves without the new flag still load in the normal Crystal Caves.
No treasure piles, generator, or stone rewards are present in the seasonal cavern.

Each of the six cave species and three dinosaurs has two roaming shiny spawns.
One shiny Ghost joins them on October 31 only. Initial spawns, respawns, encounter
sprites, catches, Party/Box, and Collection must all keep the shiny variant.
Calendar refresh removes Ghost spawns outside Halloween and empties cavern
wildlife outside October. Closing the cavern returns the player to (7,5), cancels
an unfinished encounter safely (including a throw animation), and keeps catches.
An old cavern save loaded outside October also returns safely to the meadow.

Verify keyboard and touch entry/exit, reachable wildlife, collision encounters,
all-shiny respawns, capture with a full party, save/reload, and October 30 → 31 →
November 1 plus the following October. Recheck normal cave entry, generator
rewards, and seasonal forest sparkles because these share navigation/calendar code.

## Permanent habitat expansion

`biomes.js` loads before `game.js`. It defines five surface tile types (14–18),
30 species, fixed normal/shiny palettes, and terrain rendering. New species have
explicit habitat IDs so they never enter meadow, water, diving, cave, or seasonal
pools. Each habitat has five common species (weight 20 each) and one special
(weight 6); walking has a 10% encounter chance after the usual grace period.
Sparkling tiles bypass grace, are consumed on arrival, and guarantee a shiny.
At least two sparkle spots are maintained near a player exploring a new biome.

The new surface patches preserve rivers, docks, seasonal tiles, trainer clearings,
other world layers, and existing save fields. Verify walking/boating reachability
from spawn, not only fast travel. Explore (M) shows discovery counts and travel
buttons. Travel requires surface land and the Explore modal; encounters and
trainer battles cannot be escaped by traveling. The home destination is (5,7).
Collection filters and shiny previews must not alter saved catches.

Browser validation should exercise all 30 weighted encounter choices, distinct
normal/shiny art at icon and encounter sizes, shiny sparkle capture in all five
habitats, full-party Box storage, reloading an older save, mobile travel, and
returning to the meadow. Also check the Halloween sparkle guarantee, October 31
Ghost restriction, and all three diving levels. New art uses the same draw
functions for encounters, Collection, Party/Box, and battles.

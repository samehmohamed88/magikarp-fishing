# Running and updating River Quest

## Dragon flight and level-100 cave wildlife

`sky.js` loads after `dragon-cave.js` and before `game.js`. It maintains 18
shiny Fire Dragons spread across the surface map. Sky wildlife is visible from
the ground, but collision encounters require riding an owned Fire Dragon.
Hover targets retain references to actual Party/Box creatures; preview sprites
cannot start flight. Digit3/Numpad3 mounts or lands; the Ride/Land button supports
touch. Flights cross surface terrain, with clear-ground landing checks and
guards against ground encounters, trainers, buildings, fishing, diving, and travel.
Encounters and battle dialogs cannot be escaped by mounting or landing.

`flying` and `flightShiny` save with the position and collection. Restoring a
flight requires an owned dragon and a valid surface position. The same sprite
draws normal/shiny wild dragons, encounters, collection icons, and the mount.
Sky encounters explicitly carry `inSky`, always have level 70 and shiny status,
and never update the cave boss's capture or defeat flags.

Defeating or catching the cave boss sets `journey.fireDragonDefeated` permanently.
Old saves with `fireDragonCaught` migrate to this unlock. Six cave creatures
(two each of Squirt Turtle, Bulb Toad, and Fire Lizard) then roam, collide, and
respawn using the cave wildlife system. They have level 100 and 524 HP; their
sprites and shiny palettes are shared with all collection and battle views.
Spawn and movement tiles exclude the entrance and boss interaction zones.
They cannot appear in ordinary land/fishing pools or Elite Four starter parties.

Run `tests/dragon-flight-smoke.cjs` with the Playwright environment below for
boss unlock/migration, reachable wildlife, captures and level cap, keyboard and
touch riding, flight persistence and terrain restrictions, sky captures and
shiny rewards, and independence from cave progression. Screenshots go to `/tmp`.

## Fire Dragon Cave and defeated-creature rewards

`dragon-cave.js` loads after `league.js` and before `game.js`. It contains the
dragon sprite, cave map, entry/exit controls, and rendering. The cave entrance at
(3,3) appears only when `journey.eliteCleared` is true, including old champion
saves and rematches. It is accessible by walking or the G guide. The cave has its
own connected map, entrance ladder at (6,8), and dragon nest at (52,16).
`underground` plus `dragonCave` selects this layer; surface, seasonal cavern,
crystal cave, and diving navigation remain separate. Invalid cave locations
recover to the entrance. Locked cave saves return safely to the surface.

First entry sets `journey.fireCaveGift` and awards 20 `journey.perfectBalls`
together with the saved cave location. Further entries/reloads award nothing.
The separate 100% Ball button or Z spends exactly one ball, saves the inventory
when thrown, and guarantees success without a random roll. Busy/lost encounters
and empty inventories cannot spend balls. Regular throws do not use this supply.

The Fire Dragon is level 70 with 374 HP. It is excluded from ordinary wildlife
and Elite Four starter parties. Cave capture marks `journey.fireDragonCaught`, adds
the level-70 creature to Party/Box and Collection, and removes its map sprite.
Running away or choosing coins leaves the dragon available for another encounter.
All new fields default safely for old saves; ball inventory and cave progress
persist independently from candies, lures, badges, and generator rewards.

Wild attacks now reach 0 HP; a final hit never triggers retaliation. At 0 HP,
the player chooses an ordinary guaranteed catch or coins: 1,000 for a shiny,
100 for a regular creature. `defeatCoinReward()` supplies the button, help,
defeat message, payment, and toast so the displayed amount matches the reward. Coin claims
are guarded by the active encounter, zero HP, and busy/lost state, then close the
encounter immediately before saving. Catch animations lock the coin choice, so
repeated input cannot collect both rewards. Coins do not add Collection entries.
Focused encounter buttons accept Space to activate their own action.

Run `tests/fire-cave-smoke.cjs` with the Playwright environment below. It covers
an actual final Elite Four victory, migration, entry/re-entry/reload rewards,
cave reachability, level-70 stats and art, capture and Box overflow, coin choice,
keyboard/touch input, empty bags, regular-ball independence, and saved progress.

## Level Candies

Every market sells a Level Candy for 20 coins. Purchases require the active
market and proximity, sufficient coins, and a safely incrementable inventory.
`journey.candies` defaults to zero for old saves and rejects invalid counts.
Buying a candy preserves any active lure. The existing `persist()` saves the
inventory together with coins, creatures, badges, and other progress.

Party's **Give candy** mode selects a creature in either Party or Box without
moving it. Each selection consumes one candy for +1 level, with the existing
level-100 cap. Empty bags and maximum-level creatures cannot consume candies;
giving is blocked outside that mode and during battles/encounters. The mode stays
active when the bag empties so repeated taps never move a creature unexpectedly.
Closing Party restores the usual transfer controls on the next opening.

Run `tests/candy-smoke.cjs` with the same Playwright environment described below.
It covers old-save migration, all six markets, insufficient funds, active-lure
compatibility, Party and Box selection, the cap, save/reload, combat stats,
keyboard controls, and touch purchases/feeding. Asset query versions are bumped
in `index.html` so refreshing loads the new UI and game code.

## Markets and gyms

`league.js` loads after `biomes.js` and before `game.js`. It defines six markets,
six gym leaders, the Champion Door, lure effects, and their UI. The existing battle
engine handles gym teams; only a full victory awards a badge. Gym wins are stored
separately from regular trainer wins in the new `journey` save field. Old saves
receive 60 coins and zero badges without changing their catches or past wins.

Lures affect weighted rare selections in eligible random land/fishing pools and
the seasonally valid Ghost roll. Existing visible swimmers and sparkle guarantees
are preserved. Encounter entry snapshots the catch bonus and consumes exactly one
charge; trainers and generator rewards do not consume charges. No timers run down
lures. Coin awards happen with successful catches and first trainer/gym wins.

The door exists only after all six recognized gym wins. The Champion Hall checks
proximity and all six badges again before granting its one-time reward. Markets,
gym challenges, and purchases require proximity. Guide travel requires surface
land and is blocked during encounters, battles, and other action dialogs.

With the server running, `tests/league-smoke.cjs` exercises old-save migration,
walk/boat reachability, actual UI purchases, insufficient funds, lure probabilities,
catching/coins, expiry, gym losses and all six wins, persistence, door/reward gates,
ordinary trainers, diving, and mobile interaction. Install Playwright in a separate
developer tooling directory and set `PLAYWRIGHT_MODULE` to that installation's
module path if it is not available to Node normally. Set `CHROMIUM_PATH` to a system
Chromium executable when needed, then run:

```bash
GAME_URL=http://127.0.0.1:8000 node tests/league-smoke.cjs
```

The test uses disposable browser contexts and writes screenshots under `/tmp`.
It does not touch player saves or require production dependencies.

## Elite Four and battle portraits

`league.js` defines four six-creature teams at level 30. The Champion prize and
all six badges gate entry. Walking onto the unlocked door starts the next battle;
the hall button supports keyboard and touch entry. Empty parties receive six
unique, randomly selected, non-shiny level-20 creatures, without filtering by
collection ownership. Nonempty parties and the Box are preserved. Gifts update
Collection and are saved before combat. Seasonal candidates obey the calendar.

`journey.eliteRound` is the next member (0–3), or 4 after completion;
`eliteCleared` records a completed challenge and `eliteReward` prevents duplicate
prizes. Old saves default to round 0. Each victory advances only the matching
current member. Reloading resumes at the next unbeaten opponent with a healed
party, and running/losses leave the round unchanged. Entry saves the return tile
outside the door. Rematches reset the round but keep the reward flag.

The fourth victory automatically gives shiny Megalodon, Mosasaurus, and Elasmosaurus
at level 30, filling Party slots first and then the Box. Reward creatures are
added after the normal party level-up so they remain exactly level 30.
`renderBattleTeams()` uses the same sprite functions as the active battle canvas
and updates active/fainted states after attacks, heals, switches, and victories.

Run `tests/elite-smoke.cjs` with the same Playwright environment as the league test.
It exercises walk-in and touch entry, old Champion saves, empty/nonempty parties,
sprite rendering, switching, losses, all 24 opponents through actual combat,
continuation/reload, final prizes and overflow, duplicate protection, and rematches.

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

Edit the game files and refresh the browser. The server serves changes
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
Catch difficulty: ordinary wildlife has a first-ball rate of at least 92%, second
throws always succeed, and failed catches cannot make creatures flee. The fishing
bite window is four seconds. Verify a forced first failure followed by a second
catch, preserving shiny state and saved Party/Box entries.
The ten new woodland species share weight 20 each in the meadow encounter pool
(16 total meadow species), including sparkling grass. They have no fishing weight
and do not enter the separate winter or mountain pools. Verify distinct normal
and shiny sprites for encounters, Party/Box, Collection (102 species), and battles,
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
Check movement and respawn boundaries, capture, Party/Box, Collection (102 species),
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
Party, Box, and Collection (102 species) must keep seasonal catches after the event.
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
diver battle. Collection must list 102 species and preview every shiny form.
No stone piles, generator interactions, or level-2 trainers appear in the Abyss.

Level-2 diver trainers have separate IDs in trainerWins. Their tiles block movement
and wildlife spawns; only adjacent players on the same level can challenge them.
Test empty-party prompts, all trainer teams, attacks/healing/switching, retreat and
reapproach, victory/level rewards, saved wins, and underwater battle presentation.
Depth changes and wild encounters must remain paused during trainer battles.

Wild encounters keep HP and temporary party HP in enc. X / Attack lowers wild HP
to a minimum of 0 and improves catch odds. At 0 HP the player chooses a guaranteed
regular-ball catch or coins (1,000 for shinies, 100 otherwise). The wild creature retaliates after non-final
attacks and failed balls, knocks out allies at 0 HP, and auto-switches to the next
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

## Roaming land creatures

`ground.js` loads before `game.js` and adds Fire Bird, Garbage Hunk, and Seabird.
It keeps four of each on reachable surface terrain: Ember Highlands, western
meadows/marsh, and sand beside rivers respectively. Ground creatures avoid
trainers, markets, gyms, doors, and cave entrances. They move on land, pause in
menus, return 20 seconds after encounters, and refresh habitat candidates when
the seasonal map changes. Catch/save/Box/battle handling uses the shared species
registry; no save migration is needed. All three have distinct shiny palettes.

Collision encounters require being on foot, completing movement, and clearing
the existing four-second encounter grace period. Flying, boating, diving,
and underground exploration cannot trigger ground encounters. Surface sparkles
on a creature's tile color its map sprite and guarantee the same shiny encounter.

Run `GAME_URL=http://127.0.0.1:8000 node tests/ground-smoke.cjs` with Playwright
available. Optional `PLAYWRIGHT_MODULE` and `CHROMIUM_PATH` select installed
runtimes. This checks keyboard collisions and catches for all three species,
normal/shiny art, save compatibility, Collection, collision guards, movement,
respawns, and seasonal rollover. The existing dragon-flight suite covers the
shared surface and flying paths. The local launchers require `ground.js`.

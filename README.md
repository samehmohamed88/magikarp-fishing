# 🎣 Magikarp River Quest

A browser adventure made for exploring, fishing, and collecting creatures. Wander
through tall grass, hop into boats at the docks, and explore the eastern mountains
in search of Bouldersaur. Watch for sparkles—you might find a shiny!

## ❄ Winter Area

Head south from the starting meadow, following the path and **↓ Winter Area**
sign. No boat is needed. Explore snowy ground and falling snow to find **Snowy**,
the area's main creature (85% of winter encounters). Its yellow triangular hood,
orange trim, dark face, blue eyes, and toothy grin are based on the supplied picture.
Shiny Snowy wears an ice-blue hood with purple trim and pink eyes.

Walking through snow can trigger encounters. Step on sparkling snow for a
guaranteed shiny Snowy encounter! Snowy can be caught, saved, and added to your
Party or Box. Its shiny form is also visible in Collection's preview.

![Snowy in the Winter Area, wearing a yellow hood with orange trim](docs/screenshots/winter.png)

![Shiny Snowy with an ice-blue hood, purple trim, and pink eyes](docs/screenshots/shiny-snowy.png)

## Trainer battles

Eight trainers are waiting in small clearings across the meadows, river routes,
mountains, and Winter Area. Look for people with a **!** over their heads.
Walk onto a neighboring tile to start a battle automatically. Catch at least one
creature first: your current party is your battle team.

Choose **Attack** (or press Space), use **Heal** once per battle, or **Run**
(Escape). When a creature faints, the next party member takes over. Beat every
creature on the trainer's team to win and give each of your party creatures a level.
Your party recovers after every battle, including a loss or retreat.

Defeated trainers show a **✓** and will not challenge you again; wins save with
your progress. After running or losing, walk away and approach again to retry.

![A trainer battle showing both creatures, HP bars, and Attack, Heal, and Run controls](docs/screenshots/trainer-battle.png)

## Play

Once GitHub Pages is enabled, open **[Magikarp River Quest](https://samehmohamed88.github.io/magikarp-fishing/)**
and bookmark it. Players need only a browser—no downloads, accounts, or terminal commands.

To enable the website, open this repository's **Settings → Pages**, choose
**Deploy from a branch**, select **main** and **/ (root)**, and save.
The link may return a 404 until the first deployment finishes.

## Screenshots

Explore the rivers by boat and look for fishing spots.

![The player boating along a river beside grassy banks and wooden docks](docs/screenshots/river.png)

Cast your rod, wait for a bite, and try to catch the creature you reel in.

![A Magikarp encounter with Throw Ball and Run buttons](docs/screenshots/fishing.png)

Build a party of up to six creatures, with extra catches stored in your Box.

![The Party menu showing a caught Magikarp and five empty party slots](docs/screenshots/party.png)

## How to play

| Action | Controls |
| --- | --- |
| Move | Arrow keys or WASD |
| Cast or reel in | Space while facing water |
| Throw a ball during an encounter | Space or **Throw Ball** |
| Attack during a trainer battle | Space or **Attack** |
| Open or close Party | P |
| Open or close Collection | C |
| Close a menu or run from an encounter | Escape |

Touch devices also have an on-screen direction pad and fishing button.
Step from a dock into the water to board a boat; return to a dock to get out.
When fishing, wait for the bite message, then press Space again quickly!

Discover nine species, including Magikarp, Frog, Fox, Bouldersaur, and Snowy.
Every species has a rare shiny form, including pink Bunny, blue Duck, purple
Squirrel, blue Fox, and mint Hedgehog. Magikarp, Frog, and Bouldersaur keep their
existing shiny colors. Check Collection to track your catches,
and use Party to move creatures between your party and Box.
In Collection, choose **✨ Preview shiny forms** to see all nine shiny designs
without changing your catches or saved progress. Bunny, Duck, Squirrel, Fox,
and Hedgehog use drawn sprites so their colors are consistent across devices.

## Saved progress

Progress saves automatically in your browser. Use the same browser, device, and
website address to continue your adventure. Clearing site data removes the save;
progress does not sync between devices.

## Development

The game uses HTML, CSS, and JavaScript with no build step or package dependencies.
To play locally with automatic updates, install Git and Python 3, then run:

```bash
git clone https://github.com/samehmohamed88/magikarp-fishing.git
cd magikarp-fishing
python3 play_auto.py
```

Open **http://localhost:8000/** in your browser. On Windows, use
`py play_auto.py` instead of `python3 play_auto.py`.
The launcher checks GitHub every 60 seconds; refresh the browser after an update.
Press Ctrl+C to stop. It skips updates when tracked files have local edits and
refuses divergent history or conflicting untracked files. If GitHub is unreachable,
the game keeps running with the current files.

To use a different interval or port:

```bash
python3 play_auto.py --interval 120 --port 8001
```

Use the same port each time to keep using the same browser save. Restart the
launcher after updates to the launcher itself.

For a server without automatic updates:

```bash
./play.sh
```

To pull later changes from GitHub safely:

```bash
./update.sh
```

See [DEVELOPMENT.md](DEVELOPMENT.md) for setup, updating, and validation details.

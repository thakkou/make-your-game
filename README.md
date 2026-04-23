# make-your-game

## Description

Single player only game made with pure JS

Tetris (from pre-approved list)

---

## Project Structure

The game relies on CSS grid for layout and `RequestAnimationFrame` for logic.
- `global.js` global variables shared between scripts
- `game.js` game logic (fall, controls, win/lose...)
- `panels.js` menu logic (score, timer, lives...)

---

## Requirements:

* Animation:
    - 60FPS (consistent animation) -> No frame drops (jank animation)
    -  RequestAnimationFrame: properly implemented (performance is measured)

* Controls:
    - using keyboard only.
    - must be smooth (no key spamming in order for it to take action).
    - if a key is kept pressed, the player must continue to do the relevant action (and stops when released).

* Pause menu (continue, restart)
    - frames should not drop if paused

* A score board that displays the following metrics:
    - Countdown clock or Timer: indicates the amount of time the player has until the game ends or the time that the game has been running
    - Score: displays the current score (XP or points)
    - Lives: shows the number of lives that the player has left

* The use of layers must be minimal but not zero in order to optimize the rendering performance.

* No frameworks or canvas: the game must be implemented using plain JS/DOM and HTML only

---

## Info

* Dev Tools
    - Page Inspector
    - Web Console
    - Performance Tool -> can record a sample of actions on the site and analyze the FPS, check for frame drops, how much time your functions take to execute, and other useful metrics monitoring.
    - Paint Flashing option -> highlights every paint that happens in your page as actions are performed on it.

--

* Enable/Disable JS in firefox:
    1. In the address bar, type: "about:config"
    2. Click “Accept the Risk and Continue”
    3. In the search bar, type: "javascript.enabled"
    4. Click the setting's toggle button

---

## Authors

- thakkou - [Github](https://github/thakkou)
- mbelhouss - [Github](https://github/DissonantVoid)
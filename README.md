<div style="display: inline-block;">
  <img src="assets/logo.png" alt="Mega Puzzle Solver Logo" width="50px" height="50px">
  <div style="font-size: 60px; display: inline-block;">Mega Puzzle Solver</div>
  <img src="assets/logo.png" alt="Mega Puzzle Solver Logo" width="50px" height="50px">
</div>

**Mega Puzzle Solver** is a Chrome extension designed to help you solve puzzles efficiently.

## Features

- Semantle: automatically solves semantle using AI and linear algebra. We us Word2Vec to vectorize words in order to compare to other words.and apply linear properties in order to algorithmically find a target goal. [section](#semantle)
- Letter Boxed: automatically solves letter boxed using webscraping internally. as basic as it sounds this required multiple script injections and unique solutions. [more info](#letter-boxed)
- Wordle: automatically solves wordle using nytimes api call `https://www.nytimes.com/svc/wordle/v2/{formattedDate}.json`
- Connections: automatically provides solutions to connections using api call `https://www.nytimes.com/svc/connections/v2/{formattedDate}.json`. unfortunately it is not possible to auto solve this game yet [more info](#connections)

- Auto Solve: currently only working for some games (all except [connections](#connections)). the button in the top right of the popup will allow for the automatic solving of the puzzles

- ...

## Installation

1. `git clone https://github.com/kylewandishin/mega-puzzle-solver`
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click on "Load unpacked" and select the folder created containing the extension files.

## Usage
1. Open Chrome and navigate to a page where you want to use Mega Puzzle Solver. ([nytimes](https://www.nytimes.com/crosswords) or [semantle](https://semantle.com/))
2. Click on the Mega Puzzle Solver icon in the toolbar to activate the extension.
3. Click the auto solve button in the top right corner and allow the extension to beat your game.

## Contributing
We welcome contributions from the community. If you have any ideas, bug fixes, or improvements, feel free to open an issue or submit a pull request.

## Semantle
(please add documentation here)<br/>
vauge description of the flask api...<br/>
We performed cosine similarity on the word we guessed with a list of possible words based on how that far that word is from the target word. Based on that, we can update the list of possible words accordingly. We can repeat these steps until the length of the possible words is just 1 or we find the word with a score of 110%.

## Connections
this is our pressing issue...<br/>
connections does not allow for simulated mouse events using dispatchEvent() or click()<br/>
connections uses isTrusted which blocks all simulated clicks. this means we cannot auto solve the game.<br/>

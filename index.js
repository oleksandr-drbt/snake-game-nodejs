const readline = require('readline/promises');
const Game = require('./Game');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const readBoardDimensions = async (message) => {
  const dimension = await rl.question(message);

  if (!dimension || isNaN(dimension) || !Number.isInteger(+dimension)) {
    console.log('Please enter a correct integer!')
    return readBoardDimensions(message);
  }

  return dimension;
};

(async () => {
  const boardWidth = await readBoardDimensions('What the game board width is? ');
  const boardHeight = await readBoardDimensions('What the game board height is? ');
  rl.close();

  const game = new Game(+boardWidth, +boardHeight);
  game.start();
})();

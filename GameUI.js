const {
  BOARD_CHARACTER,
  SNAKE_CHARACTER,
  FOOD_CHARACTER,
  DEFAULT_SNAKE_LENGTH,
} = require('./config');

class GameUI {
  snakeCoordinates = [{ x: 0, y: 0 }];
  foodCoordinate = { x: 0, y: 0 };

  constructor(boardWidth, boardHeight) {
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
  }

  setSnake(snakeCoordinates) {
    this.snakeCoordinates = snakeCoordinates;
  }

  setFood(foodCoordinate) {
    this.foodCoordinate = foodCoordinate;
  }

  render() {
    let ui = '';

    for (let i = 0; i < this.boardHeight; i++) {
      for (let j = 0; j < this.boardWidth; j++) {
        if (this._isSnake(this.snakeCoordinates, { x: j, y: i })) {
          ui += SNAKE_CHARACTER;
        } else if (this._isFood(this.foodCoordinate, { x: j, y: i })) {
          ui += FOOD_CHARACTER;
        } else {
          ui += BOARD_CHARACTER;
        }
      }
      ui += '\n';
    }

    // Clear screen
    process.stdout.write('\x1Bc');
    // Display game board
    process.stdout.write(ui);
  }

  showGameOver() {
    process.stdout.write(`Game over! Your score: ${this.snakeCoordinates.length - DEFAULT_SNAKE_LENGTH}`);
  }

  _isSnake(snakeCoordinates, { x, y }) {
    return !!snakeCoordinates.find((partOfSnake) => partOfSnake.x === x && partOfSnake.y === y);
  }

  _isFood(foodCoordinate, { x, y }) {
    return foodCoordinate.x === x && foodCoordinate.y === y;
  }
}

module.exports = GameUI;
